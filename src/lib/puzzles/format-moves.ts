interface FormattedMove {
    prefix: string;
    san: string;
  }
  
  /**
   * ფორმატირებას უკეთებს SAN სვლების ისტორიას ჭადრაკის სტანდარტული ნოტაციით (მაგ: "1. e4", "1... e5").
   */
  export function formatSanHistory(fen: string, sanHistory: string[]): FormattedMove[] {
    if (!fen || !sanHistory.length) return [];
  
    const fenParts = fen.split(" ");
    const blackFirst = fenParts[1] === "b";
    const startNum = Number(fenParts[5] || 1);
  
    return sanHistory.map((san, index) => {
      let prefix = "";
      if (blackFirst) {
        if (index === 0) prefix = `${startNum}... `;
        else if ((index - 1) % 2 === 0)
          prefix = `${startNum + 1 + Math.floor((index - 1) / 2)}. `;
      } else {
        if (index % 2 === 0)
          prefix = `${startNum + Math.floor(index / 2)}. `;
      }
      return { prefix, san };
    });
  }