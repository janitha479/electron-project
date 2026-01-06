// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const scanBtn = document.getElementById('scanBtn')
const statusEl = document.getElementById('status')
const ssidList = document.getElementById('ssidList')

function renderSSIDs(list) {
	ssidList.innerHTML = ''
	if (!list || list.length === 0) {
		ssidList.innerHTML = '<li>No profiles found</li>'
		return
	}
	for (const item of list) {
		const li = document.createElement('li')
		const nameSpan = document.createElement('strong')
		nameSpan.textContent = item.ssid
		const pwd = item.password ? item.password : '(no password found)'
		li.appendChild(nameSpan)
		li.appendChild(document.createTextNode(` — ${pwd}`))
		ssidList.appendChild(li)
	}
}

scanBtn.addEventListener('click', async () => {
	statusEl.textContent = 'Scanning...'
	try {
		const res = await window.api.scanWifi()
		if (res && res.error) {
			statusEl.textContent = `Error: ${res.error}`
			renderSSIDs([])
		} else if (res && res.profiles) {
			statusEl.textContent = 'Done'
			renderSSIDs(res.profiles)
		} else {
			statusEl.textContent = 'No data returned'
			renderSSIDs([])
		}
	} catch (e) {
		statusEl.textContent = `Error: ${e && e.message ? e.message : e}`
	}
})