export default function timeFromUUID(uuid: String): number | undefined {
    if (!uuid) return undefined;
    const hexTimestamp = uuid.replace(/-/g, '').substring(0, 12);
    const ms = parseInt(hexTimestamp, 16);
    return ms;
}