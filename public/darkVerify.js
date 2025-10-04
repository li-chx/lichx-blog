// darkVerify.js
if (
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    document.querySelector('html').classList.add('dark');
    document.querySelector('html').classList.remove('light');
    localStorage.setItem('system-theme-mode', 'dark');
} else {
    document.querySelector('html').classList.add('light');
    document.querySelector('html').classList.remove('dark');
    localStorage.setItem('system-theme-mode', 'light');
}
