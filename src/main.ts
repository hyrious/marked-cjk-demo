import './style.css'
import { marked } from 'marked'

const dark$ = matchMedia('(prefers-color-scheme: dark)')
const getTheme = () => dark$.matches ? 'dark' : 'light'
const updateTheme = () => { document.body.dataset.theme = getTheme() }
dark$.addEventListener('change', updateTheme)
updateTheme()

declare const $clear: HTMLButtonElement
declare const $example: HTMLButtonElement
declare const $official: HTMLButtonElement
declare const $input: HTMLTextAreaElement
declare const $preview: HTMLButtonElement
declare const $html: HTMLButtonElement
declare const $markdown: HTMLDivElement
declare const $source: HTMLPreElement

$clear.onclick = () => {
	$input.value = ''
	$input.dispatchEvent(new InputEvent('change'))
}
$input.oninput = $input.onchange = $input.onpaste = () => {
	$markdown.innerHTML = $source.textContent = marked($input.value, { async: false })
	history.pushState({ text: $input.value }, '', $input.value ? `?text=${encodeURIComponent($input.value)}` : location.pathname)
}
const toggle = (preview: boolean) => {
	$preview.disabled = preview
	$html.disabled = !preview
	$markdown.style.display = preview ? '' : 'none'
	$source.style.display = !preview ? '' : 'none'
}
$preview.onclick = () => toggle(true)
$html.onclick = () => toggle(false)

const example = '这是一个**“会引起”**渲染错误的**“已知问题”**，当加重符号\\*\\*遇到某些中文标点时，可能就会出现**“识别不了”**的情况。就如这句话展现的一样。'
$example.onclick = async () => {
	$example.disabled = true
	let str = ''
	for (const char of example) {
		str += char
		$input.value = str
		$input.dispatchEvent(new InputEvent('change'))
		await new Promise(r => setTimeout(r, 50))
	}
	$example.disabled = false
}

$official.onclick = () => {
	window.open(`https://marked.js.org/demo/?text=${encodeURIComponent($input.value)}`, '_blank')
}

let init = new URL(location.href).searchParams.get('text')
if (init) { $input.value = init }
$input.dispatchEvent(new InputEvent('change'))
