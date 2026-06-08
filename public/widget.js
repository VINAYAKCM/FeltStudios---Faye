(function () {
  "use strict";

  // ─── Config ────────────────────────────────────────────────────────────────
  var API_URL = "http://localhost:3000/api/chat";
  var OPENING_MESSAGE =
    "Hey — you've reached Studio Felt. We design products that people feel. What can I help with?";
  var CALENDAR_TRIGGER = "[SHOW_CALENDAR]";
  var CALENDAR_URL = "https://cal.com/cm-vignesh?embed=true";
  var QUICK_REPLIES = ["See our work", "What you do", "Book a call"];

  // ─── State ─────────────────────────────────────────────────────────────────
  var conversationHistory = [];
  var isOpen = false;
  var isStreaming = false;
  var quickRepliesShown = false;
  var calendarShown = false;

  // ─── Styles ────────────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    /* Reset — padding intentionally excluded: ID specificity would override class padding rules */
    "#sf-widget-root *{box-sizing:border-box;margin:0;}",

    /* PANEL */
    ".felt-panel{width:420px;height:100vh;max-height:680px;background:#000000;border:none;",
    "border-radius:20px;position:fixed;bottom:24px;left:24px;display:flex;flex-direction:column;",
    "overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;",
    "box-shadow:0 32px 64px rgba(0,0,0,0.6);z-index:99999;",
    "opacity:0;transform:translateY(12px) scale(0.97);pointer-events:none;",
    "transition:opacity 0.28s cubic-bezier(.4,0,.2,1),transform 0.28s cubic-bezier(.4,0,.2,1);}",
    ".felt-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}",

    /* TOP BAR */
    ".felt-topbar{position:absolute;top:0;left:0;right:0;padding:20px 20px;",
    "display:flex;align-items:center;justify-content:space-between;z-index:10;}",
    ".felt-topbar-left{display:flex;align-items:center;gap:16px;}",
    ".felt-topbar-btn{width:36px;height:36px;border-radius:50%;",
    "background:rgba(255,255,255,0.12);border:none;cursor:pointer;",
    "display:flex;align-items:center;justify-content:center;",
    "color:#fff;font-size:18px;line-height:1;}",
    ".felt-topbar-btn:hover{background:rgba(255,255,255,0.2);}",

    /* MESSAGES AREA */
    ".felt-messages{flex:1;overflow-y:auto;padding:80px 32px 24px 32px;",
    "display:flex;flex-direction:column;justify-content:flex-end;scrollbar-width:none;}",
    ".felt-messages::-webkit-scrollbar{display:none;}",

    /* MESSAGE BLOCK */
    ".felt-message-block{margin-bottom:40px;}",
    ".felt-message-block:last-child{margin-bottom:0;}",

    /* SENDER LABEL ROW */
    ".felt-label-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;}",
    ".felt-sender{font-size:13px;font-weight:500;color:rgba(255,255,255,0.35);}",
    ".felt-timestamp{font-size:13px;color:rgba(255,255,255,0.25);}",

    /* MESSAGE TEXT */
    ".felt-message-text{font-size:17px;padding-bottom:15px;font-weight:500;color:#ffffff;line-height:1.4;",
    "white-space:pre-wrap;letter-spacing:-0.02em;word-break:break-word;}",

    /* CHIPS */
    ".felt-chips{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin-top:16px;padding-bottom:10px}",
    ".felt-chip{padding:8px 10px;background:rgba(255,255,255,0.1);border:none;border-radius:100px;",
    "font-size:16px;font-weight:400;color:rgba(255,255,255,0.75);cursor:pointer;",
    "transition:background 0.15s,color 0.15s;display:inline-flex;align-items:center;",
    "font-family:inherit;white-space:nowrap;}",
    ".felt-chip:hover{background:rgba(255,255,255,0.18);color:#fff;}",

    /* CALENDAR EMBED */
    ".felt-cal-card{width:100%;height:500px;border-radius:12px;overflow:hidden;",
    "background:#111;margin-top:12px;}",
    ".felt-cal-card iframe{width:100%;height:100%;border:none;display:block;}",

    /* INPUT AREA */
    ".felt-input-area{padding:16px 32px 28px;display:flex;align-items:center;gap:12px;border-top:none;flex-shrink:0;}",
    ".felt-input{flex:1;background:transparent;border:none;outline:none;",
    "font-size:16px;color:rgba(255,255,255,0.5);font-family:inherit;padding:0;}",
    ".felt-input::placeholder{color:rgba(255,255,255,0.25);}",

    /* PILL */
    ".felt-pill{position:fixed;bottom:24px;left:24px;background:#1a1a1a;color:#fff;border:none;",
    "border-radius:100px;padding:20px 24px;font-size:15px;",
    "font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;",
    "cursor:pointer;z-index:99998;transition:transform 0.2s ease,opacity 0.2s ease;",
    "user-select:none;}",
    ".felt-pill:hover{transform:scale(1.03);}",
    ".felt-pill.hidden{opacity:0;pointer-events:none;transform:scale(0.85);}",
    ".felt-pill.retracting{opacity:0;pointer-events:none;}",

    /* TYPING PULSE */
    ".felt-pulse{display:flex;gap:4px;align-items:center;padding:4px 0;margin-top:4px;}",
    ".felt-pulse span{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.35);",
    "animation:felt-bounce 1.2s ease-in-out infinite;}",
    ".felt-pulse span:nth-child(2){animation-delay:0.2s;}",
    ".felt-pulse span:nth-child(3){animation-delay:0.4s;}",
    "@keyframes felt-bounce{0%,80%,100%{transform:translateY(0);opacity:0.35;}",
    "40%{transform:translateY(-5px);opacity:0.9;}}",
  ].join("");
  document.head.appendChild(style);

  // ─── DOM Construction ───────────────────────────────────────────────────────
  var root = document.createElement("div");
  root.id = "sf-widget-root";

  // Pill
  var pill = document.createElement("button");
  pill.className = "felt-pill";
  pill.setAttribute("aria-label", "Open Studio Felt chat");
  pill.textContent = "Let's work together";

  // Panel
  var panel = document.createElement("div");
  panel.className = "felt-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Studio Felt chat");

  // Topbar + messages + input
  panel.innerHTML = [
    '<div class="felt-topbar">',
    '  <div class="felt-topbar-left">',
    '    <button class="felt-topbar-btn" id="sf-btn-back" aria-label="Go back">&#8249;</button>',
    '  </div>',
    '  <button class="felt-topbar-btn" id="sf-btn-close" aria-label="Close chat">&#215;</button>',
    '</div>',
    '<div class="felt-messages"></div>',
    '<div class="felt-input-area">',
    '  <input class="felt-input" type="text" placeholder="Ask me anything…" aria-label="Message input" autocomplete="off" />',
    "</div>",
  ].join("");

  root.appendChild(panel);
  root.appendChild(pill);
  document.body.appendChild(root);

  // Grab live refs
  var messagesEl = panel.querySelector(".felt-messages");
  var inputEl = panel.querySelector(".felt-input");
  var btnBack = panel.querySelector("#sf-btn-back");
  var btnClose = panel.querySelector("#sf-btn-close");

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function currentTime() {
    var d = new Date();
    var h = String(d.getHours()).padStart(2, "0");
    var m = String(d.getMinutes()).padStart(2, "0");
    return h + ":" + m;
  }

  function createMetaRow(label) {
    var meta = document.createElement("div");
    meta.className = "felt-label-row";
    meta.innerHTML =
      '<span class="felt-sender">' + label + '</span>' +
      '<span class="felt-timestamp">' + currentTime() + '</span>';
    return meta;
  }

  function createBotBubble() {
    var msg = document.createElement("div");
    msg.className = "felt-message-block bot";
    msg.appendChild(createMetaRow("Felt"));
    var bubble = document.createElement("div");
    bubble.className = "felt-message-text";
    // Pulse indicator
    bubble.innerHTML =
      '<div class="felt-pulse"><span></span><span></span><span></span></div>';
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    scrollToBottom();
    return { msg: msg, bubble: bubble };
  }

  function appendBotMessage(text, showCalendar) {
    var ref = createBotBubble();
    ref.bubble.innerHTML = "";
    var textNode = document.createTextNode(text);
    ref.bubble.appendChild(textNode);

    if (showCalendar) {
      appendCalendar(ref.msg);
    }
    scrollToBottom();
    return ref;
  }

  function appendCalendar(parentEl) {
    var card = document.createElement("div");
    card.className = "felt-cal-card";
    var iframe = document.createElement("iframe");
    iframe.src = CALENDAR_URL;
    iframe.title = "Book a call with Studio Felt";
    iframe.loading = "lazy";
    card.appendChild(iframe);
    parentEl.appendChild(card);
  }

  function appendUserBubble(text) {
    var msg = document.createElement("div");
    msg.className = "felt-message-block user";
    msg.appendChild(createMetaRow("You"));
    var bubble = document.createElement("div");
    bubble.className = "felt-message-text";
    bubble.textContent = text;
    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    scrollToBottom();
  }

  function showQuickReplies() {
    if (quickRepliesShown) return;
    quickRepliesShown = true;

    // Attach chips to the first bot message
    var firstBot = messagesEl.querySelector(".felt-message-block.bot");
    if (!firstBot) return;

    var chips = document.createElement("div");
    chips.className = "felt-chips";
    chips.id = "sf-chips";

    QUICK_REPLIES.forEach(function (label) {
      var chip = document.createElement("button");
      chip.className = "felt-chip";
      chip.textContent = label;
      chip.addEventListener("click", function () {
        chips.remove();
        sendMessage(label);
      });
      chips.appendChild(chip);
    });

    firstBot.appendChild(chips);
    scrollToBottom();
  }

  function setStreaming(state) {
    isStreaming = state;
    inputEl.disabled = state;
  }

  // ─── API / SSE ─────────────────────────────────────────────────────────────
  function sendMessage(text) {
    if (!text.trim() || isStreaming) return;

    appendUserBubble(text);
    conversationHistory.push({ role: "user", content: text });
    inputEl.value = "";

    setStreaming(true);

    var ref = createBotBubble();
    var accumulated = "";
    var pulseRemoved = false;

    function removePulse() {
      if (pulseRemoved) return;
      pulseRemoved = true;
      ref.bubble.innerHTML = "";
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory }),
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (j) {
            throw new Error(j.error || "HTTP " + res.status);
          });
        }
        return res.body;
      })
      .then(function (body) {
        var reader = body.getReader();
        var decoder = new TextDecoder();
        var leftover = "";
        var finished = false;

        function pump() {
          reader.read().then(function (result) {
            if (result.done) {
              if (!finished) finish();
              return;
            }

            leftover += decoder.decode(result.value, { stream: true });
            var lines = leftover.split("\n");
            leftover = lines.pop(); // keep incomplete line

            lines.forEach(function (line) {
              line = line.trim();
              if (!line.startsWith("data:")) return;
              var payload = line.slice(5).trim();
              if (payload === "[DONE]") {
                if (!finished) finish();
                return;
              }
              try {
                var parsed = JSON.parse(payload);
                if (parsed.token) {
                  removePulse();
                  accumulated += parsed.token;
                  // Show raw accumulated text while streaming;
                  // [SHOW_CALENDAR] will be stripped in finish()
                  ref.bubble.textContent = accumulated;
                  scrollToBottom();
                }
                if (parsed.error) {
                  removePulse();
                  ref.bubble.textContent = "Something went wrong — try again.";
                  if (!finished) finish();
                }
              } catch (e) {
                // non-JSON line, ignore
              }
            });

            pump();
          });
        }

        pump();

        function finish() {
          finished = true;

          // Post-stream: detect and strip [SHOW_CALENDAR] from the full text
          var shouldShowCalendar = false;
          if (!calendarShown && accumulated.includes(CALENDAR_TRIGGER)) {
            shouldShowCalendar = true;
            accumulated = accumulated.split(CALENDAR_TRIGGER).join("").trim();
          } else if (accumulated.includes(CALENDAR_TRIGGER)) {
            // Already shown — just strip the trigger string silently
            accumulated = accumulated.split(CALENDAR_TRIGGER).join("").trim();
          }

          // Write the clean text into the bubble
          if (!pulseRemoved) removePulse();
          ref.bubble.textContent = accumulated || "Something went wrong — try again.";

          // Append calendar iframe once, guarded by session flag
          if (shouldShowCalendar) {
            calendarShown = true;
            appendCalendar(ref.msg);
          }

          var finalText = accumulated.trim();
          if (finalText) {
            conversationHistory.push({ role: "assistant", content: finalText });
          }
          showQuickReplies();
          setStreaming(false);
          scrollToBottom();
        }
      })
      .catch(function (err) {
        console.error("[sf-widget]", err);
        removePulse();
        ref.bubble.textContent = "Something went wrong — try again.";
        setStreaming(false);
        scrollToBottom();
      });
  }

  // ─── Open / Close animation ────────────────────────────────────────────────
  var pillRetractTimer = null;

  function openWidget() {
    if (isOpen) return;
    isOpen = true;

    // 1. Pill retracts into circle
    pill.classList.add("retracting");

    // 2. After retract settles, hide pill and open panel
    pillRetractTimer = setTimeout(function () {
      pill.classList.add("hidden");
      panel.classList.add("open");

      // Hardcoded opening message on first open
      if (messagesEl.children.length === 0) {
        appendBotMessage(OPENING_MESSAGE);
        setTimeout(showQuickReplies, 120);
      }

      setTimeout(function () {
        inputEl.focus();
      }, 300);
    }, 320);
  }

  function closeWidget() {
    if (!isOpen) return;
    isOpen = false;

    if (pillRetractTimer) clearTimeout(pillRetractTimer);

    panel.classList.remove("open");

    // Fade pill back in after panel hides
    setTimeout(function () {
      pill.classList.remove("hidden");
      setTimeout(function () {
        pill.classList.remove("retracting");
      }, 40);
    }, 260);
  }

  // ─── Events ────────────────────────────────────────────────────────────────
  pill.addEventListener("click", function () {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  // Close button
  btnClose.addEventListener("click", function () {
    closeWidget();
  });

  // Back button — remove last user+bot exchange from DOM and history
  btnBack.addEventListener("click", function () {
    // Need at least one user message to go back
    var allMsgs = messagesEl.querySelectorAll(".felt-message-block");
    if (allMsgs.length <= 1) {
      // Only the opening bot message — just close
      closeWidget();
      return;
    }

    // Remove last bot message (and any calendar card inside it)
    var lastBot = null;
    var lastUser = null;
    for (var i = allMsgs.length - 1; i >= 0; i--) {
      if (!lastBot && allMsgs[i].classList.contains("bot")) lastBot = allMsgs[i];
      else if (!lastUser && allMsgs[i].classList.contains("user")) { lastUser = allMsgs[i]; break; }
    }
    if (lastBot) lastBot.remove();
    if (lastUser) lastUser.remove();

    // Pop the last assistant+user pair from conversation history
    if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "assistant") {
      conversationHistory.pop();
    }
    if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === "user") {
      conversationHistory.pop();
    }

    // If calendar was shown in the removed exchange, allow it again
    if (lastBot && lastBot.querySelector(".felt-cal-card")) {
      calendarShown = false;
    }

    scrollToBottom();
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeWidget();
  });
})();
