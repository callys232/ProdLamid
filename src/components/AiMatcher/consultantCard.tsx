import ScoreBar from "./scoreBoard";

export default function ConsultantCard({ consultant, score }: any) {
    return (
        <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition hover:scale-[1.01]">

            <h3 className="font-semibold text-black">{consultant.name}</h3>

            <div className="mt-3 space-y-2">
                <ScoreBar label="AI Match" value={score.semantic} />
                <ScoreBar label="Skill Match" value={score.skillMatch} />
                <ScoreBar label="Experience" value={score.experience} />
                <ScoreBar label="Rating" value={score.rating} />
            </div>

            <div className="mt-3 text-sm text-gray-500">
                {consultant.skills.slice(0, 5).join(", ")}
            </div>

            <button className="mt-4 w-full bg-[#c12129] text-white py-2 rounded-md hover:bg-red-700 transition">
                Compare
            </button>
        </div>
    );
}