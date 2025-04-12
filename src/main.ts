import { WebContainer } from "@webcontainer/api";
import { projectFiles } from "./projectFiles";
import "./style.css";

// Get UI elements
const iframeEl = document.getElementById("preview-iframe")!;
const terminalEl = document.getElementById("terminal")!;
const status1El = document.querySelector("#controls p:nth-of-type(1)")!;
const status2El = document.querySelector("#controls p:nth-of-type(2)")!;

logStatus("Loading WebContainer...");
let webcontainerInstance;

try {
  logStatus("Booting WebContainer...");
  webcontainerInstance = await WebContainer.boot();
  logStatus("WebContainer Booted.");

  logStatus("Mounting project files...");
  await webcontainerInstance.mount(projectFiles);
  logStatus("Files Mounted.");

  // Listener for server readiness
  webcontainerInstance.on("server-ready", (port, url) => {
    logStatus(`Server ready on port ${port}`, `Preview loaded.`);
    iframeEl.src = url; // Update iframe source
  });

  // Listener for container errors
  webcontainerInstance.on("error", ({ message }) => {
    logStatus("WebContainer Error:", message);
    console.error("WebContainer Error:", message);
  });

  // --- Run npm install ---
  logStatus("Running pnpm install...", "(this may take a moment)");
  const installProcess = await webcontainerInstance.spawn("pnpm", ["install"]);

  // Pipe output to terminal
  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        logTerminal(data);
      },
    })
  );

  // Wait for install process to exit
  const installExitCode = await installProcess.exit;
  if (installExitCode !== 0) {
    throw new Error(`pnpm install failed with exit code ${installExitCode}`);
  }
  logStatus("pnpm install complete.");

  // --- Run npm start ---
  logStatus("Starting dev server (npm start)...");
  logTerminal("\n\n$ pnpm start^\n");
  const startProcess = await webcontainerInstance.spawn("pnpm", [
    "start",
    "--",
    "--no-open",
  ]);

  // Pipe output to terminal
  startProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        logTerminal(data);
      },
    })
  );
} catch (error: any) {
  logStatus("Error initializing playground:", error.message);
  console.error("Initialization Error:", error);
  if (webcontainerInstance) {
    // Optional: Attempt to tear down the instance on error
  }
}

// Helper function for status updates
function logStatus(msg1, msg2 = "") {
  console.log(msg1, msg2);
  status1El.textContent = `Status: ${msg1}`;
  status2El.textContent = msg2;
}

// Helper function to append data to the terminal
function logTerminal(data) {
  terminalEl.textContent += data;
  // Auto-scroll to the bottom
  terminalEl.scrollTop = terminalEl.scrollHeight;
}
