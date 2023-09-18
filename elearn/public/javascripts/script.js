// Function to open the modal
function openModal() {
    document.getElementById("code-editor-modal").style.display = "block";
    editor.refresh(); // Refresh CodeMirror editor when the modal is opened
}

// Function to close the modal
function closeModal() {
    document.getElementById("code-editor-modal").style.display = "none";
}

// Initialize CodeMirror
const editor = CodeMirror(document.getElementById("code"), {
    mode: "python",
    theme: "default",
    lineNumbers: true,
});

// Event listeners for opening and closing the modal
document.getElementById("try-it-yourself-button").addEventListener("click", openModal);
document.getElementsByClassName("close")[0].addEventListener("click", closeModal);

// Function to check Python code
document.getElementById("check-button").addEventListener("click", function () {
    const code = editor.getValue();

    // Use Skulpt to check for syntax errors
    const output = Sk.importMainWithBody("<stdin>", false, code);
    if (output.$d) {
        document.getElementById("result").innerHTML = "Code is correct!";
        document.getElementById("result").style.color = "green";
    } else {
        document.getElementById("result").innerHTML = "Syntax Error: " + output.toString();
        document.getElementById("result").style.color = "red";
    }
});
