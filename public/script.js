const input = document.getElementById("input");
const generateBtn = document.getElementById("generate-btn");
const responseContainer = document.getElementById("response");
const loader = document.querySelector(".loader");

async function generate() {
  if (input.value.trim().length === 0) {
    alert("Please provide an input");
    input.value = "";
    return;
  }
  responseContainer.innerHTML = "";
  loader.style.display = "block";

  try {
    const res = await fetch("/gemini-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input.value }),
    });
    const data = await res.json();
    if (data) {
      loader.style.display = "none";
    }
    responseContainer.innerHTML = data.response;
  } catch (err) {
    console.log(err);
  }
}

generateBtn.onclick = generate;
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generate();
  }
});
