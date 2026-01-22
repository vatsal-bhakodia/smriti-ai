const CGPAFormula = () => {
    return (
        <div className="flex items-center justify-center py-4">
            <div className="text-center">
                <span className="text-2xl italic text-zinc-300">CGPA</span>
                <span className="text-2xl text-zinc-300 mx-2">=</span>
                <span className="inline-flex flex-col items-center">
                    <span className="text-lg text-zinc-300 border-b border-zinc-500 px-2 pb-1">
                        ΣΣC<sub className="text-sm">ni</sub>G<sub className="text-sm">ni</sub>
                    </span>
                    <span className="text-lg text-zinc-300 px-2 pt-1">
                        ΣΣC<sub className="text-sm">ni</sub>
                    </span>
                </span>
            </div>
        </div>
    )
}

export default CGPAFormula