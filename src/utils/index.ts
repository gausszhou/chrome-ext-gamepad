export function numberToSequence(n: number) {
    const mapping = ['A', 'B', 'X', 'Y'];
    let result = '';
    do {
        const remainder = n % 4;
        result = mapping[remainder] + result;
        n = Math.floor(n / 4);
    } while (n > 0);
    return result || 'A'; // 处理 n=0 的情况
}