export function speakText(text: string) {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1.2
    utterance.volume = 0.8

    // Try to find a more mystical voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Female") || voice.name.includes("Samantha") || voice.name.includes("Victoria"),
    )

    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    window.speechSynthesis.speak(utterance)
  }
}
