const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const statusText = document.getElementById("status");
const downloadBtn = document.getElementById("downloadBtn");
const dropArea = document.getElementById("dropArea");

let currentJobId = null;
let pollInterval = null;

chooseBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  uploadBtn.disabled = !fileInput.files.length;
});

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  uploadBtn.disabled = true;
  statusText.textContent = "Uploading...";

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/files/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (!data.jobId) {
    statusText.textContent = data.message;
    uploadBtn.disabled = false;
    return;
  }

  currentJobId = data.jobId;
  statusText.textContent = "Conversion started...";
  startPolling();
});

function startPolling() {
  pollInterval = setInterval(async () => {
    const response = await fetch(`/api/files/status/${currentJobId}`);
    const data = await response.json();

    statusText.textContent = `Status: ${data.status}`;

    if (data.status === "completed") {
      clearInterval(pollInterval);
      downloadBtn.style.display = "inline-block";
    }
  }, 2000);
}

downloadBtn.addEventListener("click", () => {
  window.location.href = `/api/files/download/${currentJobId}`;
});