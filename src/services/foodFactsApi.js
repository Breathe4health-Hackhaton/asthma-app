export async function fetchProductInfo(barcode, userAllergies = "") {
  try {
    const response = await fetch(`https://tr.openfoodfacts.org/api/v2/product/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1) {
      const product = data.product;
      
      // 1. Get Additives and Allergens arrays
      const additives = product.additives_tags || [];
      const allergens = product.allergens_tags || [];
      
      // 2. Explicitly look for Asthma Triggers among additives
      const hasSulfites = additives.some(tag => tag.toLowerCase().includes('e22') || tag.toLowerCase().includes('sulfite'));
      const hasMSG = additives.some(tag => tag.toLowerCase().includes('e621') || tag.toLowerCase().includes('msg') || tag.toLowerCase().includes('glutamate'));
      const hasTartrazine = additives.some(tag => tag.toLowerCase().includes('e102') || tag.toLowerCase().includes('tartrazine'));
      const hasBenzoates = additives.some(tag => tag.toLowerCase().includes('e211') || tag.toLowerCase().includes('benzoate'));
      
      const warnings = [];
      
      if (hasSulfites) warnings.push("Sülfit (Koruyucu E22x) saptandı! Astım atağını tetikleyebilir.");
      if (hasMSG) warnings.push("Monosodyum Glutamat (MSG) bulundu! Hassasiyete neden olabilir.");
      if (hasTartrazine) warnings.push("Tartrazin Renklendirici (E102) bulundu! Astımlılarda reaksiyon yapabilir.");
      if (hasBenzoates) warnings.push("Benzoat koruyucusu saptandı. Tetikleyici olabilir.");

      // 3. Process Generic Allergens
      if (allergens.length > 0) {
        // e.g. en:milk, en:soybeans turns to MILK, SOYBEANS
        const formattedAllergens = allergens.map(a => a.replace('en:', '').replace('tr:', '').toUpperCase()).join(', ');
        warnings.push(`Genel Alerjen İçeriyor: ${formattedAllergens}`);
      }

      // 4. Personalized Allergy Cross-Reference (from user's profile)
      let userAllergyFound = false;
      if (userAllergies && userAllergies.trim() !== '') {
        const userList = userAllergies.split(',').map(item => item.trim().toLowerCase());
        const allProductText = (
           additives.join(' ') + ' ' + 
           allergens.join(' ') + ' ' + 
           (product.ingredients_text || '')
        ).toLowerCase();
        
        for (let wa of userList) {
          if (allProductText.includes(wa)) {
            warnings.push(`KİŞİSEL ALERJEN UYARISI: Bu ürün profilinizde belirttiğiniz "${wa.toUpperCase()}" maddesini içeriyor olabilir!`);
            userAllergyFound = true;
          }
        }
      }
      
      const dangerous = hasSulfites || hasMSG || hasTartrazine || hasBenzoates || allergens.length > 0 || userAllergyFound;
      
      return {
        found: true,
        name: product.product_name || "Bilinmeyen Ürün",
        dangerous,
        warnings,
        brand: product.brands || "Belirtilmemiş Marka",
        image: product.image_front_url || null
      };
    }
    return { found: false };
  } catch (err) {
    console.error("Open Food Facts Error", err);
    return { found: false, error: true };
  }
}
