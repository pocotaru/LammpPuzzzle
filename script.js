// ゲーム状態管理
const gameState = {
  lampCount: 0,
  currentTrial: 0,
  phase: 'setup', // 'setup', 'input_lit', 'finished'
  litLamps: [],
  possiblePositions: {},
  currentGuess: [],
  history: [],
};

// DOM要素
const elements = {
  setupArea: document.getElementById('setup-area'),
  gameArea: document.getElementById('game-area'),
  finishArea: document.getElementById('finish-area'),
  lampCountInput: document.getElementById('lamp-count'),
  startBtn: document.getElementById('start-btn'),
  resetBtn: document.getElementById('reset-btn'),
  lampGrid: document.getElementById('lamp-grid'),
  confirmBtn: document.getElementById('confirm-btn'),
  clearBtn: document.getElementById('clear-btn'),
  trialTitle: document.getElementById('trial-title'),
  guessOrder: document.getElementById('guess-order'),
  instruction: document.getElementById('instruction'),
  historyList: document.getElementById('history-list'),
  finishText: document.getElementById('finish-text'),
  restartBtn: document.getElementById('restart-btn'),
};

// イベントリスナー
elements.startBtn.addEventListener('click', startGame);
elements.resetBtn.addEventListener('click', resetGame);
elements.confirmBtn.addEventListener('click', confirmLitLamps);
elements.clearBtn.addEventListener('click', clearLamps);
elements.restartBtn.addEventListener('click', resetGame);

// ゲーム開始
function startGame() {
  const count = parseInt(elements.lampCountInput.value);
  if (count < 3 || count > 10) {
    alert('ランプ数は3～10の範囲で指定してください');
    return;
  }

  gameState.lampCount = count;
  gameState.currentTrial = 1;
  gameState.phase = 'input_lit';
  gameState.history = [];

  // 初期化: possible_positions[lamp] = {1..N}
  gameState.possiblePositions = {};
  for (let i = 1; i <= count; i++) {
    gameState.possiblePositions[i] = new Set();
    for (let j = 1; j <= count; j++) {
      gameState.possiblePositions[i].add(j);
    }
  }

  // 初期推測は [1,2,3,...,N]
  gameState.currentGuess = Array.from({ length: count }, (_, i) => i + 1);

  // UI更新
  elements.setupArea.style.display = 'none';
  elements.gameArea.style.display = 'block';
  elements.resetBtn.style.display = 'inline-block';

  renderLampGrid();
  updateTrialInfo();
}

// ランプグリッド描画
function renderLampGrid() {
  elements.lampGrid.innerHTML = '';
  gameState.litLamps = [];

  for (let i = 1; i <= gameState.lampCount; i++) {
    const lamp = document.createElement('div');
    lamp.className = 'lamp off';
    const span = document.createElement('span');
    span.textContent = i;
    lamp.appendChild(span);
    lamp.dataset.lampId = i;
    lamp.addEventListener('click', toggleLamp);
    elements.lampGrid.appendChild(lamp);
  }
}

// ランプのトグル
function toggleLamp(e) {
  const lampId = parseInt(e.currentTarget.dataset.lampId);
  const lampElement = e.currentTarget;

  if (lampElement.classList.contains('off')) {
    lampElement.classList.remove('off');
    lampElement.classList.add('on');
    gameState.litLamps.push(lampId);
  } else {
    lampElement.classList.remove('on');
    lampElement.classList.add('off');
    gameState.litLamps = gameState.litLamps.filter(id => id !== lampId);
  }
}

// ランプをクリア
function clearLamps() {
  gameState.litLamps = [];
  document.querySelectorAll('.lamp').forEach(lamp => {
    lamp.classList.remove('on');
    lamp.classList.add('off');
  });
}

// 点灯確定
function confirmLitLamps() {
  const litLamps = [...gameState.litLamps].sort((a, b) => a - b);

  // バックアップ
  const backup = {};
  for (let lamp in gameState.possiblePositions) {
    backup[lamp] = new Set(gameState.possiblePositions[lamp]);
  }

  // 制約更新
  updateConstraints(gameState.possiblePositions, gameState.currentGuess, litLamps);
  propagateConstraints(gameState.possiblePositions);

  // 解が存在するか確認
  const feasibleGuesses = findAllFeasibleGuesses(gameState.possiblePositions, gameState.lampCount);

  if (feasibleGuesses.length === 0) {
    alert('矛盾した状態になりました。入力を確認してください。');
    // ロールバック
    gameState.possiblePositions = backup;
    return;
  }

  // 履歴に追加
  addHistory(gameState.currentTrial, gameState.currentGuess, litLamps);

  // 全部確定したか判定
  const allFixed = Object.values(gameState.possiblePositions).every(s => s.size === 1);

  if (allFixed) {
    finishGame();
    return;
  }

  // 自動的に上位(最初)の推測を次の試行にセット
  gameState.currentGuess = feasibleGuesses[0];
  gameState.currentTrial++;
  gameState.phase = 'input_lit';

  // ランプグリッドをリセット
  renderLampGrid();
  updateTrialInfo();
}

// 制約更新（Pythonコードと同じロジック）
function updateConstraints(possiblePositions, guess, litLamps) {
  for (let pos = 1; pos <= guess.length; pos++) {
    const lamp = guess[pos - 1];
    if (litLamps.includes(lamp)) {
      // lamp は pos 確定
      possiblePositions[lamp] = new Set([pos]);
      // 他のランプから pos を除外
      for (let otherLamp in possiblePositions) {
        if (parseInt(otherLamp) !== lamp) {
          possiblePositions[otherLamp].delete(pos);
        }
      }
    } else {
      // lamp は pos ではない
      possiblePositions[lamp].delete(pos);
    }
  }
}

// 制約伝播
function propagateConstraints(possiblePositions) {
  let changed = true;
  let loopCount = 0;

  while (changed) {
    loopCount++;
    if (loopCount > 1000) {
      console.error('Too many loops in propagate_constraints');
      return;
    }

    changed = false;

    // (1) ランプ候補が1つだけなら確定
    for (let lamp in possiblePositions) {
      const posSet = possiblePositions[lamp];
      if (posSet.size === 1) {
        const pos = Array.from(posSet)[0];
        for (let otherLamp in possiblePositions) {
          if (otherLamp !== lamp && possiblePositions[otherLamp].has(pos)) {
            possiblePositions[otherLamp].delete(pos);
            changed = true;
          }
        }
      }
    }

    // (2) ポジションpを取れるランプ候補が1つだけなら確定
    const allPositions = new Set();
    for (let lamp in possiblePositions) {
      possiblePositions[lamp].forEach(p => allPositions.add(p));
    }

    for (let pos of allPositions) {
      const candidates = [];
      for (let lamp in possiblePositions) {
        if (possiblePositions[lamp].has(pos)) {
          candidates.push(parseInt(lamp));
        }
      }

      if (candidates.length === 1) {
        const lampSingle = candidates[0];
        if (possiblePositions[lampSingle].size !== 1 || !possiblePositions[lampSingle].has(pos)) {
          possiblePositions[lampSingle] = new Set([pos]);
          changed = true;

          for (let otherLamp in possiblePositions) {
            if (parseInt(otherLamp) !== lampSingle && possiblePositions[otherLamp].has(pos)) {
              possiblePositions[otherLamp].delete(pos);
              changed = true;
            }
          }
        }
      }
    }
  }
}

// 実行可能な推測を全て列挙（最大数制限付き）
function findAllFeasibleGuesses(possiblePositions, N, maxCount = 100) {
  const lamps = Object.keys(possiblePositions).map(k => parseInt(k));
  const results = [];
  const assignment = new Array(N);
  const used = new Set();

  function backtrack(posIdx) {
    if (results.length >= maxCount) return;

    if (posIdx === N) {
      results.push([...assignment]);
      return;
    }

    const pos = posIdx + 1;
    for (let lamp of lamps) {
      if (!used.has(lamp) && possiblePositions[lamp].has(pos)) {
        assignment[posIdx] = lamp;
        used.add(lamp);
        backtrack(posIdx + 1);
        used.delete(lamp);
      }
    }
  }

  backtrack(0);
  return results;
}

// 試行情報更新
function updateTrialInfo() {
  elements.trialTitle.textContent = `第${gameState.currentTrial}試行`;

  if (gameState.phase === 'input_lit') {
    renderOrderSequence(elements.guessOrder, gameState.currentGuess);
    elements.instruction.textContent = '点灯しているランプをクリックしてください';
  }
}

// 順序表示の共通関数
function renderOrderSequence(container, lampOrder) {
  container.innerHTML = '';

  const sequence = document.createElement('div');
  sequence.className = 'order-sequence';

  lampOrder.forEach((lampId, index) => {
    // ランプアイコン
    const lampDiv = document.createElement('div');
    lampDiv.className = 'order-lamp';
    const span = document.createElement('span');
    span.textContent = lampId;
    lampDiv.appendChild(span);
    sequence.appendChild(lampDiv);

    // 矢印（最後以外）
    if (index < lampOrder.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'order-arrow';
      arrow.textContent = '➜';
      sequence.appendChild(arrow);
    }
  });

  container.appendChild(sequence);
}

// 履歴追加
function addHistory(trial, guess, litLamps) {
  const item = document.createElement('div');
  item.className = 'history-item';

  const title = document.createElement('strong');
  title.textContent = `第${trial}試行:`;
  item.appendChild(title);

  const lampsDiv = document.createElement('div');
  lampsDiv.className = 'history-lamps';

  guess.forEach(lampId => {
    const lampIcon = document.createElement('div');
    lampIcon.className = 'history-lamp-icon';
    if (litLamps.includes(lampId)) {
      lampIcon.classList.add('lit');
    }
    const span = document.createElement('span');
    span.textContent = lampId;
    lampIcon.appendChild(span);
    lampsDiv.appendChild(lampIcon);
  });

  item.appendChild(lampsDiv);
  elements.historyList.insertBefore(item, elements.historyList.firstChild);
}

// ゲーム終了
function finishGame() {
  gameState.phase = 'finished';

  // 確定した配置
  const finalAssignment = new Array(gameState.lampCount);
  for (let lamp in gameState.possiblePositions) {
    const pos = Array.from(gameState.possiblePositions[lamp])[0];
    finalAssignment[pos - 1] = parseInt(lamp);
  }

  // 確定順を表示（共通レイアウトを使用）
  elements.trialTitle.textContent = `第${gameState.currentTrial + 1}試行 ☆確定☆`;
  elements.guessOrder.className = 'final-order';
  renderOrderSequence(elements.guessOrder, finalAssignment);
  elements.instruction.textContent = `${gameState.currentTrial}回の試行で全てのランプの位置が確定しました！`;

  // ランプグリッドを非表示にして終了ボタンを表示
  elements.lampGrid.style.display = 'none';
  elements.confirmBtn.style.display = 'none';
  elements.clearBtn.style.display = 'none';

  // 終了ボタンを追加
  const finishBtn = document.createElement('button');
  finishBtn.className = 'btn btn-primary finish-btn';
  finishBtn.textContent = '終了';
  finishBtn.addEventListener('click', resetGame);

  const buttonGroup = document.querySelector('.button-group');
  buttonGroup.innerHTML = '';
  buttonGroup.appendChild(finishBtn);

  // 最終表示を履歴に追加（全てのランプを点灯状態で表示）
  const item = document.createElement('div');
  item.className = 'history-item';
  item.style.borderColor = '#d4af37';
  item.style.background = 'rgba(212, 175, 55, 0.2)';

  const title = document.createElement('strong');
  title.textContent = `第${gameState.currentTrial + 1}試行 ☆確定☆:`;
  item.appendChild(title);

  const lampsDiv = document.createElement('div');
  lampsDiv.className = 'history-lamps';

  finalAssignment.forEach(lampId => {
    const lampIcon = document.createElement('div');
    lampIcon.className = 'history-lamp-icon lit'; // 全て点灯状態
    const span = document.createElement('span');
    span.textContent = lampId;
    lampIcon.appendChild(span);
    lampsDiv.appendChild(lampIcon);
  });

  item.appendChild(lampsDiv);
  elements.historyList.insertBefore(item, elements.historyList.firstChild);
}

// リセット
function resetGame() {
  gameState.lampCount = 0;
  gameState.currentTrial = 0;
  gameState.phase = 'setup';
  gameState.litLamps = [];
  gameState.possiblePositions = {};
  gameState.currentGuess = [];
  gameState.history = [];

  elements.setupArea.style.display = 'block';
  elements.gameArea.style.display = 'none';
  elements.finishArea.style.display = 'none';
  elements.resetBtn.style.display = 'none';
  elements.lampGrid.style.display = 'grid';
  elements.historyList.innerHTML = '';

  // ボタングループをリセット
  const buttonGroup = document.querySelector('.button-group');
  buttonGroup.innerHTML = '';

  const confirmBtn = document.createElement('button');
  confirmBtn.id = 'confirm-btn';
  confirmBtn.className = 'btn btn-primary';
  confirmBtn.textContent = '確定';
  confirmBtn.addEventListener('click', confirmLitLamps);

  const clearBtn = document.createElement('button');
  clearBtn.id = 'clear-btn';
  clearBtn.className = 'btn btn-secondary';
  clearBtn.textContent = 'クリア';
  clearBtn.addEventListener('click', clearLamps);

  buttonGroup.appendChild(confirmBtn);
  buttonGroup.appendChild(clearBtn);

  // 要素参照を更新
  elements.confirmBtn = confirmBtn;
  elements.clearBtn = clearBtn;

  // guessOrderのclassNameをリセット
  elements.guessOrder.className = 'guess-order';
}
