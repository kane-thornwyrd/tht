import { Drug, Pharmacy } from "./pharmacy";

const randInt = (max) => Math.floor(Math.random() * max)

const REASONABLE_PRODUCT_LIFETIME = 20
const MIN_BENEFIT = 0
const MAX_BENEFIT = 50
const MIN_EXPIRATION_REMAINING = -Infinity
const MAX_EXPIRATION_REMAINING = Infinity

const constrainBenefit = (benefit) => (cb) => 
  Math.min(Math.max(cb(benefit), MIN_BENEFIT), MAX_BENEFIT)

const constrainExpiresIn = (expiresIn) => (cb) => 
  Math.min(Math.max(cb(expiresIn), MIN_EXPIRATION_REMAINING), MAX_EXPIRATION_REMAINING)

const given_a_shelflife_simulation_of = (a_drug_behavior) => {
  const baseDrugInfos = {
    expiresIn: REASONABLE_PRODUCT_LIFETIME / 2, 
    benefit: constrainBenefit(REASONABLE_PRODUCT_LIFETIME)(b => b + randInt(REASONABLE_PRODUCT_LIFETIME))
  }
  const SIMULATION_DURATION = baseDrugInfos.expiresIn * 2
  const { drugName, expireInAlgorithm, benefitAlgorithm } = a_drug_behavior(baseDrugInfos, SIMULATION_DURATION)

  const shelfLife = [new Drug(drugName,baseDrugInfos.expiresIn, baseDrugInfos.benefit)]
  for (let elapsed = 1; elapsed < SIMULATION_DURATION; elapsed++) {
    shelfLife.push(
      new Drug(drugName, 
        constrainExpiresIn(shelfLife[elapsed - 1].expiresIn)(expireInAlgorithm(shelfLife[elapsed - 1], elapsed)), 
        constrainBenefit(shelfLife[elapsed - 1].benefit)(benefitAlgorithm(shelfLife[elapsed - 1], elapsed))
      )
    )
  }
  return shelfLife
}

const the_drug_data_should_match = (simulatedShelfLife) => () => {

  const realShelfLife = [[simulatedShelfLife[0]]]

  for (let elapsed = 1; elapsed < simulatedShelfLife.length; elapsed++) {
    const { expiresIn, benefit } = realShelfLife[elapsed -1][0]
    const result = new Pharmacy([new Drug(simulatedShelfLife[0].name, expiresIn, benefit)]).updateBenefitValue()
    realShelfLife.push(result)

    expect([simulatedShelfLife[elapsed]]).toEqual(result);
  }
}

const a_generic_drug_behavior = (baseDrugInfos) => {
  const GENERIC_DETERIORATION_RATE = 1
  const GENERIC_ACCELERATED_DETERIORATION_RATE = GENERIC_DETERIORATION_RATE * 2
  return {
    drugName: 'generic',
    expireInAlgorithm: () => expiresIn => expiresIn - 1,
    benefitAlgorithm : (_, elapsed) => benefit =>
          baseDrugInfos.expiresIn >= elapsed ? 
            benefit - GENERIC_DETERIORATION_RATE : 
            benefit - GENERIC_ACCELERATED_DETERIORATION_RATE
  }
}

const a_herbalTea_behavior = (baseDrugInfos) => {
  const HERBALTEA_IMPROVEMENT_RATE = 1
  const HERBALTEA_ACCELERATED_IMPROVEMENT_RATE = HERBALTEA_IMPROVEMENT_RATE * 2
  return {
    drugName: 'Herbal Tea',
    expireInAlgorithm: () => expiresIn => expiresIn - 1,
    benefitAlgorithm : (_, elapsed) => benefit =>
          baseDrugInfos.expiresIn >= elapsed ? 
            benefit + HERBALTEA_IMPROVEMENT_RATE : 
            benefit + HERBALTEA_ACCELERATED_IMPROVEMENT_RATE
  }
}

const a_magic_pill_behavior = (baseDrugInfos) => {
  return {
    drugName: 'Magic Pill',
    expireInAlgorithm: () => expiresIn => expiresIn,
    benefitAlgorithm : (_, elapsed) => benefit => benefit
  }
}

const a_fervex_behavior = (baseDrugInfos) => {
  const FERVEX_IMPROVEMENT_RATE = 1
  const FERVEX_TEN_DAYS_IMPROVEMENT_RATE = 2
  const FERVEX_FIVE_DAYS_IMPROVEMENT_RATE = 3
  return {
    drugName: 'Fervex',
    expireInAlgorithm: () => expiresIn => expiresIn - 1,
    benefitAlgorithm : (_, elapsed) => benefit => {
      switch (true) {
        case baseDrugInfos.expiresIn < elapsed:
          return 0
        case baseDrugInfos.expiresIn - elapsed < 5:
          return benefit + FERVEX_FIVE_DAYS_IMPROVEMENT_RATE
        case baseDrugInfos.expiresIn - elapsed < 10:
          return benefit + FERVEX_TEN_DAYS_IMPROVEMENT_RATE
        default:
          return benefit + FERVEX_IMPROVEMENT_RATE
      }
    }
  }
}

// const a_dafalgan_behavior = (baseDrugInfos) => {
//   const GENERIC_DETERIORATION_RATE = 1
//   const GENERIC_ACCELERATED_DETERIORATION_RATE = GENERIC_DETERIORATION_RATE * 2
//   return {
//     drugName: 'generic',
//     expireInAlgorithm: () => expiresIn => expiresIn - 1,
//     benefitAlgorithm : (_, elapsed) => benefit =>
//           baseDrugInfos.expiresIn >= elapsed ? 
//             benefit - GENERIC_DETERIORATION_RATE : 
//             benefit - GENERIC_ACCELERATED_DETERIORATION_RATE
//   }
// }

describe("Pharmacy", () => {
  it('should calculate the benefit evolution of generic drug', the_drug_data_should_match(given_a_shelflife_simulation_of(a_generic_drug_behavior)))

  it('should calculate the benefit evolution of herbal tea', the_drug_data_should_match(given_a_shelflife_simulation_of(a_herbalTea_behavior)))

  it('should calculate the benefit evolution of magic pills', the_drug_data_should_match(given_a_shelflife_simulation_of(a_magic_pill_behavior)))

  it('should calculate the benefit evolution of Fervex', the_drug_data_should_match(given_a_shelflife_simulation_of(a_fervex_behavior)))


});
