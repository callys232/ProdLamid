const WEIGHTS = {
    semantic: 0.5,
    skill: 0.2,
    experience: 0.1,
    rating: 0.1,
    reliability: 0.1,
};

export async function scoreConsultant(project, consultant) {
    const projectText = `${project.description} ${project.skills.join(" ")}`;
    const consultantText = `
    ${consultant.skills.join(" ")}
    ${consultant.portfolio.map(p => p.description).join(" ")}
  `;

    const semantic = await getSemanticScore(projectText, consultantText);

    const skillMatch =
        project.skills.filter(s =>
            consultant.skills.includes(s)
        ).length / project.skills.length;

    const experience = Math.min(consultant.experienceYears / 10, 1);
    const rating = consultant.rating / 5;
    const reliability = Math.min(consultant.completedProjects / 50, 1);

    const total =
        semantic * WEIGHTS.semantic +
        skillMatch * WEIGHTS.skill +
        experience * WEIGHTS.experience +
        rating * WEIGHTS.rating +
        reliability * WEIGHTS.reliability;

    return { total, semantic, skillMatch, experience, rating, reliability };
}