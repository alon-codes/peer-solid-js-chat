export async function copyToClipboard(value: string) {
    return navigator.clipboard.writeText(value);
}