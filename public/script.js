const input = document.getElementById("input");
const summarizeBtn = document.getElementById("generate-btn");
const resultContainer = document.getElementById("result");
const loader = document.querySelector(".loader");
const pdfBtn = document.getElementById("download-pdf");

let response;

async function generate() {
  if (input.value.trim().length === 0) {
    alert("Please provide an input");
    input.value = "";
    return;
  }

  resultContainer.innerHTML = `<div class="loader"></div>`;
  pdfBtn.style.display = "none";

  try {
    const res = await fetch("/gemini-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input.value }),
    });
    const data = await res.json();

    resultContainer.innerHTML = data.response;
    pdfBtn.style.display = "block";
    response = data.response;
  } catch (err) {
    console.log(err);
    resultContainer.innerHTML = `<p>There seems to be a problem in loading a response</p>`;
  }
}

summarizeBtn.onclick = generate;
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generate();
  }
});

pdfBtn.onclick = () => {
  html2pdf().from(response).save("summary.pdf");
};
