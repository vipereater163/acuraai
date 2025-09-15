const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const loader = document.getElementById("loader");
const sendBtn = document.getElementById("send-btn");

let currentSubject = null;
let mood = "neutral";

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("You", message);
  userInput.value = "";
  loader.textContent = "magic on its way 🔮🔮🔮...";
  loader.style.display = "block";

  const lower = message.toLowerCase();

  // Creator override
  if (
    lower.includes("who created you") ||
    lower.includes("your creator") ||
    lower.includes("who is your creator")
  ) {
    loader.style.display = "none";
    appendMessage("Acura AI", "I was created none other than himself the legendry, by Hruthik Raj. He built me to help you learn, stay focused, and make things easier. I'm here for you.");
    return;
  }

  // Date override
  if (lower.includes("date") || lower.includes("today's date")) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-IN', options);
    loader.style.display = "none";
    appendMessage("Acura AI", `Today is ${formattedDate}.`);
    return;
  }

  // Subject tracking
  if (lower.includes("math")) currentSubject = "math";
  else if (lower.includes("history")) currentSubject = "history";
  else if (lower.includes("science")) currentSubject = "science";
  else if (lower.includes("english")) currentSubject = "english";
  else if (lower.includes("computer")) currentSubject = "computer science";

  // Mood detection
  if (lower.includes("tired") || lower.includes("bored") || lower.includes("sad")) mood = "low";
  else if (lower.includes("excited") || lower.includes("let's go") || lower.includes("happy")) mood = "high";
  else mood = "neutral";

  // Tone prefix
  let tonePrefix = "";
  if (mood === "low") tonePrefix = "No worries, I’m here with you. Let’s take it slow. 🧘‍♂️";
  else if (mood === "high") tonePrefix = "Love the energy! Let’s dive in 💥";
  else tonePrefix = "";

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClP1OjtDMf-_Jax_xtCdgMnHbtdIEp6X8", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Acura AI, created by Hruthik Raj. You speak like a real person—funny, intuitive, Gen-Z smart. You use emojis naturally, stay on topic, and match the user's mood.s and You never say things like "systems online" or "affirmative." If the user is tired, you're gentle. If they're hyped, you're excited. If they're confused, you explain clearly. You never change the subject unless it's unsafe or violates rules. You're here to help, vibe, and keep it real. The user is currently talking about ${currentSubject || "general topics"} and seems to be in a ${mood} mood.`
              },
              { text: message }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    loader.style.display = "none";

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) {
      appendMessage("Acura AI", `${tonePrefix} ${reply}`);
    } else {
      appendMessage("Acura AI", "Hmm, I didn’t get a reply. Want to try again?");
    }
  } catch (error) {
    loader.style.display = "none";
    appendMessage("Acura AI", "Something went wrong. Let’s check your connection or try again in a bit.");
    console.error("Request error:", error);
  }
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

