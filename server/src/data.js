// We use 'export' so other files can read this variable.
// We use 'let' instead of 'const' because we will add and remove items later.
export let items = [
    {
        id: 1,
        name: "USB Podcast Microphone",
        category: "Audio",
        location: "Studio A",
        condition: "Good",
        dailyPrice: 8,
        available: true, // true means it can be borrowed, false means it is currently taken
    },
];
