// Footer component for the pension calculator
"use client";

export function CalculatorFooter() {
    return (
        <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                            💰 Calcolatore Fondo Pensione
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Uno strumento professionale per pianificare il tuo
                            futuro finanziario con precisione e trasparenza.
                        </p>
                    </div>
                    <div className="text-center">
                        <h4 className="text-lg font-semibold mb-4 text-blue-300">
                            Caratteristiche
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                            <li>✅ Calcolo in tempo reale</li>
                            <li>📊 Analisi dettagliata</li>
                            <li>💾 Export dati CSV</li>
                            <li>📱 Design responsive</li>
                        </ul>
                    </div>
                    <div className="text-center md:text-right">
                        <h4 className="text-lg font-semibold mb-4 text-green-300">
                            Informazioni
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            I calcoli sono basati su proiezioni matematiche e
                            non costituiscono consulenza finanziaria
                            professionale.
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-6 text-center">
                    <p className="text-sm text-gray-400">
                        © 2025 Calcolatore Fondo Pensione | Made with ❤️ for
                        your financial future
                    </p>
                </div>
            </div>
        </footer>
    );
}
