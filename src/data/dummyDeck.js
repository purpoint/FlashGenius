// The single source of truth for the app's content until the AI is wired up.
// The generated deck will arrive in exactly this shape, so nothing outside
// this file may assume a fixed number of flashcards or quiz questions.

export const dummyDeck = {
  title: 'Photosynthesis and Cellular Respiration',
  sourceWordCount: 842,
  flashcards: [
    {
      id: 'c1',
      question: 'What are the two stages of photosynthesis?',
      answer:
        'The light-dependent reactions, which occur in the thylakoid membrane, and the Calvin cycle, which occurs in the stroma.',
    },
    {
      id: 'c2',
      question: 'What is the overall equation for photosynthesis?',
      answer:
        '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Six carbon dioxide and six water molecules become one glucose and six oxygen.',
    },
    {
      id: 'c3',
      question: 'Where does the oxygen released by photosynthesis come from?',
      answer:
        'From water, not carbon dioxide. Photolysis splits H₂O in photosystem II to replace the electrons lost by chlorophyll, releasing O₂ as a by-product.',
    },
    {
      id: 'c4',
      question: 'What do the light-dependent reactions actually produce?',
      answer:
        'ATP and NADPH, plus oxygen. Both ATP and NADPH are then spent by the Calvin cycle in the stroma.',
    },
    {
      id: 'c5',
      question: 'What does RuBisCO do in the Calvin cycle?',
      answer:
        'It fixes carbon — attaching CO₂ to the five-carbon sugar RuBP. The unstable six-carbon product immediately splits into two molecules of 3-phosphoglycerate.',
    },
    {
      id: 'c6',
      question: 'Why is the Calvin cycle called light-independent rather than "dark"?',
      answer:
        'It does not use light directly, but it depends on the ATP and NADPH made in the light, so it stalls in darkness. It does not run at night in any meaningful way.',
    },
    {
      id: 'c7',
      question: 'What are the four stages of aerobic cellular respiration?',
      answer:
        'Glycolysis in the cytoplasm, pyruvate oxidation and the Krebs cycle in the mitochondrial matrix, and oxidative phosphorylation at the inner mitochondrial membrane.',
    },
    {
      id: 'c8',
      question: 'How does chemiosmosis generate ATP?',
      answer:
        'The electron transport chain pumps protons into the intermembrane space, creating a gradient. Protons flow back through ATP synthase, and that flow drives the phosphorylation of ADP.',
    },
    {
      id: 'c9',
      question: 'What is the final electron acceptor in aerobic respiration?',
      answer:
        'Oxygen. It accepts electrons at the end of the transport chain and combines with protons to form water. Without it the chain backs up and ATP production collapses.',
    },
    {
      id: 'c10',
      question: 'How are photosynthesis and respiration related?',
      answer:
        'They are near-inverses: the products of one are the reactants of the other. Both rely on electron transport chains and chemiosmosis, but photosynthesis stores energy in glucose while respiration releases it.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      difficulty: 'easy',
      question: 'Where do the light-dependent reactions take place?',
      options: [
        { id: 'a', text: 'The stroma' },
        { id: 'b', text: 'The thylakoid membrane' },
        { id: 'c', text: 'The mitochondrial matrix' },
        { id: 'd', text: 'The cell wall' },
      ],
      correctOptionId: 'b',
      explanation:
        'The thylakoid membrane holds the chlorophyll and photosystems that capture light.',
    },
    {
      id: 'q2',
      difficulty: 'easy',
      question: 'Which gas is released as a by-product of photosynthesis?',
      options: [
        { id: 'a', text: 'Carbon dioxide' },
        { id: 'b', text: 'Nitrogen' },
        { id: 'c', text: 'Oxygen' },
        { id: 'd', text: 'Methane' },
      ],
      correctOptionId: 'c',
      explanation:
        'Splitting water in photosystem II releases oxygen, which diffuses out of the leaf.',
    },
    {
      id: 'q3',
      difficulty: 'medium',
      question: 'Which stage of respiration produces the most ATP?',
      options: [
        { id: 'a', text: 'Glycolysis' },
        { id: 'b', text: 'Pyruvate oxidation' },
        { id: 'c', text: 'The Krebs cycle' },
        { id: 'd', text: 'Oxidative phosphorylation' },
      ],
      correctOptionId: 'd',
      explanation:
        'Glycolysis and the Krebs cycle each net only a couple of ATP directly. Oxidative phosphorylation accounts for roughly 26–28 of the ~30–32 ATP per glucose.',
    },
    {
      id: 'q4',
      difficulty: 'medium',
      question: 'What is the immediate role of NADPH in the Calvin cycle?',
      options: [
        { id: 'a', text: 'It reduces 3-phosphoglycerate to G3P' },
        { id: 'b', text: 'It fixes carbon dioxide onto RuBP' },
        { id: 'c', text: 'It absorbs photons in photosystem I' },
        { id: 'd', text: 'It pumps protons across the thylakoid membrane' },
      ],
      correctOptionId: 'a',
      explanation:
        'NADPH is the reducing agent: it donates electrons that convert 3-PGA into G3P. Carbon fixation itself is RuBisCO’s job.',
    },
    {
      id: 'q5',
      difficulty: 'hard',
      question:
        'A drug makes the inner mitochondrial membrane freely permeable to protons. What happens?',
      options: [
        { id: 'a', text: 'The electron transport chain stops immediately' },
        {
          id: 'b',
          text: 'Electron transport continues but ATP synthesis falls, releasing heat',
        },
        { id: 'c', text: 'ATP synthase runs faster, so ATP output rises' },
        { id: 'd', text: 'Oxygen consumption drops to zero' },
      ],
      correctOptionId: 'b',
      explanation:
        'This is uncoupling. The proton gradient dissipates, so ATP synthase has nothing to drive it, but the chain keeps running — often faster — and the energy leaves as heat. Brown fat does this on purpose with thermogenin.',
    },
  ],
  warnings: [],
};

export default dummyDeck;
