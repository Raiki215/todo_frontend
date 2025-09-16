let activeRecognition: SpeechRecognition | null = null;

/**
 * 音声認識を開始し、テキストを返す。
 * キャンセル時は "aborted" または "cancelled" で reject。
 */
const recognizeVoice = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject("このブラウザは音声認識に対応していません");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    activeRecognition = recognition;

    let done = false;

    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      try {
        const transcript = event.results[0][0].transcript as string;
        done = true;
        resolve(transcript);
      } finally {
        activeRecognition = null;
      }
    };

    recognition.onerror = (event: any) => {
      done = true;
      activeRecognition = null;
      // Chromeでは abort() 時に error: "aborted" が来ることがある
      reject(event?.error ?? "unknown-error");
    };

    recognition.onend = () => {
      // 一部環境では onerror ではなく onend のみになる場合がある
      if (!done) {
        activeRecognition = null;
        reject("cancelled");
      }
    };

    recognition.start();
  });
};

/**
 * 進行中の音声認識をキャンセル
 */
export function cancelRecognition() {
  try {
    activeRecognition?.abort?.();
  } finally {
    activeRecognition = null;
  }
}

/**
 * 進行中の音声認識を停止（結果があれば onresult が呼ばれる）。
 * ユーザーが「完了」したいときに使用。
 */
export function stopRecognition() {
  try {
    activeRecognition?.stop?.();
  } finally {
    // activeRecognition の解放は onresult/onend 側で行う
  }
}

export default recognizeVoice;
