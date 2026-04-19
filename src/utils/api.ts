export async function fetchRecommendation(
    businessType: string,
    complexity: string,
    field: string,
    role?: string
) {
    const res = await fetch(
        `/api/recommendations?businessType=${businessType}&complexity=${complexity}&field=${field}&role=${role}`
    );
    return res.json();
}
