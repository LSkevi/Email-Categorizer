/**
 * Translates classification labels while preserving the original response text
 * @param {string} classification - The original classification from backend (in Portuguese)
 * @param {function} t - The translation function from i18next
 * @returns {string} - The translated classification label
 */
export const translateClassification = (classification, t) => {
  if (!classification || typeof classification !== "string") {
    return classification || "";
  }

  const normalized = classification.toLowerCase().trim();

  // Map backend classifications to translation keys
  if (normalized === "produtivo" || normalized.includes("produtiv")) {
    // Make sure it's not "improdutivo"
    if (!normalized.includes("improdutiv")) {
      return t("classifications.produtivo", "Produtivo");
    }
  }

  if (normalized === "improdutivo" || normalized.includes("improdutiv")) {
    return t("classifications.improdutivo", "Improdutivo");
  }

  if (normalized === "erro" || normalized.includes("erro")) {
    return t("classifications.erro", "Erro");
  }

  if (normalized === "desconhecido" || normalized.includes("desconhecido")) {
    return t("classifications.desconhecido", "Desconhecido");
  }

  // Fallback to original if no match found
  return classification;
};

/**
 * Checks if a classification is unproductive for styling purposes
 * @param {string} classification - The classification to check
 * @returns {boolean} - True if unproductive
 */
export const isUnproductiveClassification = (classification) => {
  if (!classification || typeof classification !== "string") {
    return false;
  }

  return classification.toLowerCase().includes("improdutiv");
};

/**
 * Checks if a classification is productive for styling purposes
 * @param {string} classification - The classification to check
 * @returns {boolean} - True if productive
 */
export const isProductiveClassification = (classification) => {
  if (!classification || typeof classification !== "string") {
    return false;
  }

  const normalized = classification.toLowerCase();
  return normalized.includes("produtiv") && !normalized.includes("improdutiv");
};
