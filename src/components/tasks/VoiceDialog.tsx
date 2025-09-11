const recognizeVoice = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject("このブラウザは音声認識に対応していません");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };
    recognition.onerror = (event: any) => {
      reject(event.error);
    };

    recognition.start();
  });
};

export default recognizeVoice;
