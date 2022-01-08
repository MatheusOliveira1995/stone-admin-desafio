export function formatDocument(document: String) {
    if(!document) return

    document = document.replace(/[^\d]/g, "");
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}