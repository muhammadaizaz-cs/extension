/**
 * QuickQR – popup.js
 * Handles QR code generation and PNG download.
 * Uses the bundled qrcode.min.js (davidshimjs/qrcodejs) library.
 */

(function () {
  "use strict";

  /* ─── DOM References ─────────────────────────────────────── */
  const inputEl        = document.getElementById("qr-input");
  const inputWrapper   = inputEl.parentElement;
  const inputClearBtn  = document.getElementById("input-clear-btn");
  const generateBtn    = document.getElementById("generate-btn");
  const clearBtn       = document.getElementById("clear-btn");
  const downloadBtn    = document.getElementById("download-btn");
  const errorMsg       = document.getElementById("error-msg");
  const errorText      = document.getElementById("error-text");
  const qrCard         = document.getElementById("qr-card");
  const qrOutput       = document.getElementById("qr-output");

  /* ─── State ──────────────────────────────────────────────── */
  let qrInstance  = null;   // holds the QRCode object
  let qrCanvas    = null;   // reference to the generated canvas
  let isGenerated = false;

  /* ─── Helpers ────────────────────────────────────────────── */

  /** Set the QR card display state: 'idle' | 'loading' | 'done' */
  function setCardState(state) {
    qrCard.setAttribute("data-state", state);
    if (state === "done") {
      qrCard.classList.add("has-qr");
    } else {
      qrCard.classList.remove("has-qr");
    }
  }

  /** Show or hide the error banner */
  function showError(message) {
    errorText.textContent = message;
    errorMsg.classList.add("visible");
    inputEl.style.borderColor = "var(--error-color)";
    inputEl.style.boxShadow   = "0 0 0 3px rgba(248, 113, 113, 0.18)";
  }

  function hideError() {
    errorMsg.classList.remove("visible");
    inputEl.style.borderColor = "";
    inputEl.style.boxShadow   = "";
  }

  /** Update the input wrapper 'has-value' class for the clear X button */
  function syncInputState() {
    if (inputEl.value.trim().length > 0) {
      inputWrapper.classList.add("has-value");
    } else {
      inputWrapper.classList.remove("has-value");
    }
  }

  /* ─── Generate QR ────────────────────────────────────────── */
  function generateQR() {
    const rawValue = inputEl.value.trim();

    if (!rawValue) {
      showError("Please enter some text or a URL to generate a QR code.");
      return;
    }

    hideError();
    isGenerated = false;
    downloadBtn.disabled = true;
    setCardState("loading");

    // Clear previous QR
    qrOutput.innerHTML = "";
    qrInstance = null;
    qrCanvas   = null;

    // Small delay so the loading animation is visible
    setTimeout(() => {
      try {
        // Create canvas element for the QR code
        qrInstance = new QRCode(qrOutput, {
          text:         rawValue,
          width:        200,
          height:       200,
          colorDark:    "#1A1826",
          colorLight:   "#F5F3FF",
          correctLevel: QRCode.CorrectLevel.H,
        });

        // QRCode renders asynchronously; poll briefly for the canvas/img
        waitForQRElement();
      } catch (err) {
        showError("Could not generate QR code. The input may be too long.");
        setCardState("idle");
        console.error("[QuickQR] QR generation error:", err);
      }
    }, 300);
  }

  /**
   * qrcodejs may render either a <canvas> or an <img> depending on
   * browser support. Poll until the element appears, then proceed.
   */
  function waitForQRElement(attempts) {
    attempts = attempts || 0;
    const canvas = qrOutput.querySelector("canvas");
    const img    = qrOutput.querySelector("img");

    if (canvas || img) {
      qrCanvas    = canvas || img;
      isGenerated = true;
      downloadBtn.disabled = false;
      setCardState("done");
    } else if (attempts < 20) {
      setTimeout(() => waitForQRElement(attempts + 1), 50);
    } else {
      showError("QR code generation timed out. Please try again.");
      setCardState("idle");
    }
  }

  /* ─── Download PNG ───────────────────────────────────────── */
  function downloadPNG() {
    if (!isGenerated) return;

    try {
      let dataURL;

      if (qrCanvas && qrCanvas.tagName === "CANVAS") {
        // Canvas → direct toDataURL
        dataURL = qrCanvas.toDataURL("image/png");
      } else if (qrCanvas && qrCanvas.tagName === "IMG") {
        // Img → draw onto a temporary canvas
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width  = qrCanvas.naturalWidth  || 200;
        tempCanvas.height = qrCanvas.naturalHeight || 200;
        const ctx = tempCanvas.getContext("2d");
        ctx.drawImage(qrCanvas, 0, 0);
        dataURL = tempCanvas.toDataURL("image/png");
      } else {
        console.warn("[QuickQR] No canvas/img element found for download.");
        return;
      }

      // Trigger download
      const link      = document.createElement("a");
      link.href       = dataURL;
      link.download   = "quickqr.png";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Brief visual feedback on the button
      flashDownloadButton();
    } catch (err) {
      console.error("[QuickQR] Download failed:", err);
    }
  }

  function flashDownloadButton() {
    const original = downloadBtn.innerHTML;
    downloadBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Saved!
    `;
    downloadBtn.style.background = "linear-gradient(135deg, #047857 0%, #059669 100%)";
    setTimeout(() => {
      downloadBtn.innerHTML = original;
      downloadBtn.style.background = "";
    }, 1800);
  }

  /* ─── Clear All ──────────────────────────────────────────── */
  function clearAll() {
    inputEl.value        = "";
    hideError();
    syncInputState();
    setCardState("idle");
    qrOutput.innerHTML   = "";
    qrInstance           = null;
    qrCanvas             = null;
    isGenerated          = false;
    downloadBtn.disabled = true;
    inputEl.focus();
  }

  /* ─── Event Listeners ────────────────────────────────────── */

  // Generate button
  generateBtn.addEventListener("click", generateQR);

  // Allow Enter key in input to trigger generation
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") generateQR();
  });

  // Input tracking for clear button & error hiding
  inputEl.addEventListener("input", () => {
    syncInputState();
    if (inputEl.value.trim().length > 0) hideError();
  });

  // Inline clear (X inside input)
  inputClearBtn.addEventListener("click", () => {
    inputEl.value = "";
    syncInputState();
    hideError();
    inputEl.focus();
  });

  // Clear all button
  clearBtn.addEventListener("click", clearAll);

  // Download button
  downloadBtn.addEventListener("click", downloadPNG);

  /* ─── Init ───────────────────────────────────────────────── */
  setCardState("idle");
  syncInputState();
  inputEl.focus();

})();
