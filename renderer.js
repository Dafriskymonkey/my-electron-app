const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    const response = await window.versions.ping();
    console.log(response); // prints out 'pong'
}
func();

const setButton = document.getElementById('set-btn');
const titleInput = document.getElementById('title');
setButton.addEventListener('click', () => {
    const title = titleInput.value;
    electronAPI.setTitle(title);
});

const openBtn = document.getElementById('open-btn');
const filePathElement = document.getElementById('filePath');
openBtn.addEventListener('click', async () => {
  const filePath = await electronAPI.openFile();
  filePathElement.innerText = filePath;
});

const counter = document.getElementById('counter');
electronAPI.handleCounter((event, value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue;
  event.sender.send('counter-value', newValue);
});