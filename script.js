"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Plus, Trash2, RotateCcw, Calculator } from "lucide-react";
// Custom rounding to 2 decimal places
function round2Custom(value) {
    const s = value.toFixed(3);
    const main = s.slice(0, -1);
    const last = parseInt(s.slice(-1));
    if (last >= 5) {
        return parseFloat((parseFloat(main) + 0.01).toFixed(2));
    }
    else {
        return parseFloat(parseFloat(main).toFixed(2));
    }
}
// Function to safely evaluate mathematical expressions with % support
function evaluateExpression(expression) {
    try {
        // Remove any whitespace
        let cleaned = expression.replace(/\s+/g, "");
        // Handle percentage operator by converting X% to (X/100)
        // Match patterns like 50% and replace with (50/100)
        cleaned = cleaned.replace(/(\d+\.?\d*)%/g, "($1/100)");
        // Only allow numbers, +, -, *, /, (, ), and decimal points
        if (!/^[0-9+\-*/().]+$/.test(cleaned)) {
            return null;
        }
        // Use Function constructor to safely evaluate the expression
        const result = new Function("return " + cleaned)();
        if (typeof result === "number" && !isNaN(result)) {
            return result;
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
export default function HomePage() {
    const [groups, setGroups] = useState([]);
    const [results, setResults] = useState(null);
    const addGroup = () => {
        setGroups([
            ...groups,
            {
                id: Date.now(),
                P: { expression: "", divisor: "3" },
                S: { expression: "", divisor: "3" },
                A: { expression: "", divisor: "3" },
            },
        ]);
    };
    const removeGroup = (groupId) => {
        setGroups(groups.filter((g) => g.id !== groupId));
    };
    const updateSection = (groupId, section, field, value) => {
        setGroups(groups.map((g) => {
            if (g.id === groupId) {
                return {
                    ...g,
                    [section]: { ...g[section], [field]: value },
                };
            }
            return g;
        }));
    };
    const processSection = (sectionData) => {
        const { expression, divisor } = sectionData;
        // Return empty result if expression is empty
        if (!expression || expression.trim() === "") {
            return { TTL: 0, AVG: 0, count: 0 };
        }
        // Evaluate the expression
        const evaluated = evaluateExpression(expression);
        if (evaluated === null) {
            return { TTL: 0, AVG: 0, count: 0 };
        }
        // First divide by 100
        const dividedBy100 = evaluated / 100;
        // Parse divisor (default to 3 if not provided or invalid)
        const divisorValue = parseFloat(divisor);
        const finalDivisor = !isNaN(divisorValue) && divisorValue !== 0 ? divisorValue : 3;
        // Calculate TTL and AVG
        const TTL = round2Custom(dividedBy100);
        const AVG = round2Custom(TTL / finalDivisor);
        return { TTL, AVG, count: 1 };
    };
    const calculate = () => {
        const P_list = [];
        const S_list = [];
        const A_list = [];
        const groupResults = groups.map((group, index) => {
            const P = processSection(group.P);
            const S = processSection(group.S);
            const A = processSection(group.A);
            P_list.push(P.AVG);
            S_list.push(S.AVG);
            A_list.push(A.AVG);
            return {
                groupNumber: index + 1,
                P,
                S,
                A,
            };
        });
        const VA = round2Custom(S_list.reduce((a, b) => a + b, 0));
        const NVA = round2Custom(P_list.reduce((a, b) => a + b, 0) + A_list.reduce((a, b) => a + b, 0));
        const T = round2Custom(P_list.reduce((a, b) => a + b, 0) +
            S_list.reduce((a, b) => a + b, 0) +
            A_list.reduce((a, b) => a + b, 0));
        const C = T !== 0 ? round2Custom(60 / T) : 0;
        setResults({
            groupResults,
            VA,
            NVA,
            T,
            C,
        });
    };
    const reset = () => {
        setGroups([]);
        setResults(null);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#121212] dark:via-[#1A1A2E] dark:to-[#16213E]", children: [_jsx("div", { className: "absolute inset-0 opacity-[0.15] dark:opacity-[0.08]", style: {
                    backgroundImage: `
            radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%),
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)
          `,
                    backgroundSize: "cover, 80px 80px, 80px 80px",
                } }), _jsx("div", { className: "relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12", children: _jsxs("div", { className: "bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl border border-white/20 dark:border-[#333333] overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-[#2979FF] dark:to-[#6366F1] p-6 md:p-8", children: _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-white dark:bg-[#2A2A2A] rounded-2xl flex items-center justify-center", children: _jsx(Calculator, { className: "w-6 h-6 text-indigo-600 dark:text-[#4A82FF]" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-white leading-tight", children: "Time Study Calculator" }), _jsx("p", { className: "text-indigo-100 dark:text-white/70 text-sm md:text-base", children: "Calculate efficiency metrics with mathematical expressions" })] })] }), _jsxs("div", { className: "flex gap-3 w-full md:w-auto", children: [_jsxs("button", { onClick: addGroup, className: "flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#2A2A2A] text-indigo-600 dark:text-[#4A82FF] px-6 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-[#333333] transition-all duration-200 font-semibold shadow-lg", children: [_jsx(Plus, { size: 20 }), "Add Group"] }), _jsxs("button", { onClick: reset, className: "flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 dark:bg-white/5 text-white px-6 py-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 font-semibold border border-white/20", children: [_jsx(RotateCcw, { size: 20 }), "Reset"] })] })] }) }), _jsxs("div", { className: "p-6 md:p-8", children: [groups.length === 0 && (_jsxs("div", { className: "text-center py-24", children: [_jsx("div", { className: "w-20 h-20 bg-indigo-100 dark:bg-[#2A2A3A] rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(Plus, { className: "w-10 h-10 text-indigo-600 dark:text-[#4A82FF]" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-700 dark:text-white mb-2", children: "No Groups Added Yet" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-6", children: "Click \"Add Group\" to start creating your time study analysis" }), _jsx("button", { onClick: addGroup, className: "bg-indigo-600 dark:bg-[#2979FF] text-white px-8 py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-[#1E60FF] transition-colors font-semibold", children: "Get Started" })] })), _jsx("div", { className: "space-y-8", children: groups.map((group, groupIndex) => (_jsxs("div", { className: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#2A2A3A] dark:to-[#2A2A40] border-2 border-indigo-200 dark:border-[#4A4A6A] rounded-2xl p-6 relative", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 bg-indigo-600 dark:bg-[#2979FF] text-white rounded-xl flex items-center justify-center font-bold text-lg", children: groupIndex + 1 }), _jsxs("h2", { className: "text-2xl font-bold text-indigo-900 dark:text-white", children: ["Group ", groupIndex + 1] })] }), _jsx("button", { onClick: () => removeGroup(group.id), className: "text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 p-3 rounded-xl transition-all duration-200", children: _jsx(Trash2, { size: 20 }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: ["P", "S", "A"].map((section) => (_jsxs("div", { className: "bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-gray-100 dark:border-[#333333]", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-800 dark:text-white", children: [section, " Section"] }), _jsx("div", { className: "w-8 h-8 bg-indigo-100 dark:bg-[#2A2A3A] rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-sm font-bold text-indigo-600 dark:text-[#4A82FF]", children: section }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2", children: "Expression" }), _jsx("input", { type: "text", value: group[section].expression, onChange: (e) => updateSection(group.id, section, "expression", e.target.value), className: "w-full px-4 py-3 border border-gray-300 dark:border-[#4A4A4A] dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#4A82FF] focus:border-transparent transition-all duration-200", placeholder: "e.g., 5*50%, 10+5, 25" })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2", children: "Divisor" }), _jsx("input", { type: "text", value: group[section].divisor, onChange: (e) => updateSection(group.id, section, "divisor", e.target.value), className: "w-full px-4 py-3 border border-gray-300 dark:border-[#4A4A4A] dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#4A82FF] focus:border-transparent transition-all duration-200", placeholder: "e.g., 100" })] }), _jsxs("div", { className: "bg-indigo-50 dark:bg-[#2A2A3A] rounded-lg p-3", children: [_jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: [_jsx("span", { className: "font-semibold", children: "Supports:" }), " ", "+, -, *, /, %, ( )"] }), _jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: [_jsx("span", { className: "font-semibold", children: "Example:" }), " ", "5*50% = 2.5"] })] })] })] }, section))) })] }, group.id))) }), groups.length > 0 && (_jsx("div", { className: "mt-12 text-center", children: _jsx("button", { onClick: calculate, className: "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-emerald-600 dark:to-green-600 text-white px-12 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-green-700 transition-all duration-200 font-bold text-lg shadow-xl transform hover:scale-105", children: "Calculate Results" }) })), results && (_jsxs("div", { className: "mt-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-8 border-2 border-green-300 dark:border-emerald-600", children: [_jsxs("div", { className: "flex items-center gap-4 mb-8", children: [_jsx("div", { className: "w-12 h-12 bg-green-600 dark:bg-emerald-600 rounded-2xl flex items-center justify-center", children: _jsx(Calculator, { className: "w-6 h-6 text-white" }) }), _jsx("h2", { className: "text-3xl font-bold text-green-900 dark:text-emerald-200", children: "Calculation Results" })] }), _jsx("div", { className: "space-y-6 mb-8", children: results.groupResults.map((gr, idx) => (_jsxs("div", { className: "bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-green-200 dark:border-emerald-700", children: [_jsxs("h3", { className: "text-xl font-bold text-gray-800 dark:text-white mb-4", children: ["Group ", gr.groupNumber, " Breakdown"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: ["P", "S", "A"].map((sectionName) => (_jsxs("div", { className: "bg-gray-50 dark:bg-[#2A2A2A] rounded-lg p-4", children: [_jsxs("p", { className: "font-semibold text-gray-700 dark:text-gray-300 mb-2", children: [sectionName, " Section:"] }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["TTL:", " ", _jsx("span", { className: "font-medium text-gray-800 dark:text-white", children: gr[sectionName].TTL })] }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["AVG:", " ", _jsx("span", { className: "font-medium text-gray-800 dark:text-white", children: gr[sectionName].AVG })] })] })] }, sectionName))) })] }, idx))) }), _jsxs("div", { className: "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-emerald-600 dark:to-green-600 text-white rounded-xl p-8", children: [_jsx("h3", { className: "text-2xl font-bold mb-6", children: "Final Output Metrics" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [
                                                        { label: "VA (Value Added)", value: results.VA },
                                                        { label: "N.VA (Non-Value Added)", value: results.NVA },
                                                        { label: "T (Total Time)", value: results.T },
                                                        { label: "C (Capacity)", value: results.C },
                                                    ].map((metric, idx) => (_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-semibold text-green-100 mb-2 text-sm", children: metric.label }), _jsx("p", { className: "text-3xl md:text-4xl font-bold", children: metric.value })] }, idx))) })] })] }))] })] }) })] }));
}
