const scanBtn = document.getElementById('scanBtn')
const statusEl = document.getElementById('status')
const ssidList = document.getElementById('ssidList')
const countEl = document.getElementById('count')

function renderSSIDs(list) {
	if (!list || list.length === 0) {
		ssidList.innerHTML = `
			<div class="text-center py-12 text-gray-400">
				<svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M12 18h.01M6.343 12.343a8 8 0 0111.314 0M3.515 9.515a12 12 0 0116.97 0"></path>
				</svg>
				<p class="text-lg">No WiFi profiles found</p>
			</div>
		`
		countEl.textContent = ''
		return
	}

	countEl.textContent = `${list.length} profile${list.length !== 1 ? 's' : ''} found`
	
	ssidList.innerHTML = list.map((item, index) => {
		const hasPassword = item.password && item.password !== '(no password found)'
		const displayPassword = item.password || 'No password stored'
		const passwordClass = hasPassword ? 'text-gray-700' : 'text-gray-400 italic'
		
		return `
			<div class="group bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3 flex-1">
						<div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
							${index + 1}
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center space-x-2">
								<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
								</svg>
								<span class="font-semibold text-gray-900 truncate">${escapeHtml(item.ssid)}</span>
							</div>
							<div class="flex items-center space-x-2 mt-1">
								<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
								</svg>
								<span class="${passwordClass} text-sm font-mono">${escapeHtml(displayPassword)}</span>
								${hasPassword ? `
									<button onclick="copyToClipboard('${escapeHtml(item.password).replace(/'/g, "\\'")}', event)" 
										class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded" 
										title="Copy password">
										<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
										</svg>
									</button>
								` : ''}
							</div>
						</div>
					</div>
				</div>
			</div>
		`
	}).join('')
}

function escapeHtml(text) {
	const div = document.createElement('div')
	div.textContent = text
	return div.innerHTML
}

async function copyToClipboard(text, event) {
	event.stopPropagation()
	try {
		await navigator.clipboard.writeText(text)
		const btn = event.currentTarget
		const originalHTML = btn.innerHTML
		btn.innerHTML = `
			<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
			</svg>
		`
		setTimeout(() => {
			btn.innerHTML = originalHTML
		}, 1500)
	} catch (err) {
		console.error('Failed to copy:', err)
	}
}

scanBtn.addEventListener('click', async () => {
	statusEl.innerHTML = `
		<div class="flex items-center space-x-2">
			<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<span>Scanning...</span>
		</div>
	`
	scanBtn.disabled = true
	scanBtn.classList.add('opacity-50', 'cursor-not-allowed', 'scanning')

	try {
		const res = await window.api.scanWifi()
		if (res && res.error) {
			statusEl.innerHTML = `
				<div class="flex items-center space-x-2 text-red-200">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>Error: ${escapeHtml(res.error)}</span>
				</div>
			`
			renderSSIDs([])
		} else if (res && res.profiles) {
			statusEl.innerHTML = `
				<div class="flex items-center space-x-2 text-green-200">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>Complete</span>
				</div>
			`
			renderSSIDs(res.profiles)
		} else {
			statusEl.innerHTML = `<span class="text-yellow-200">No data returned</span>`
			renderSSIDs([])
		}
	} catch (e) {
		statusEl.innerHTML = `
			<div class="flex items-center space-x-2 text-red-200">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>Error: ${escapeHtml(e && e.message ? e.message : String(e))}</span>
			</div>
		`
	} finally {
		scanBtn.disabled = false
		scanBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'scanning')
	}
})

// Make copyToClipboard available globally for inline onclick handlers
window.copyToClipboard = copyToClipboard