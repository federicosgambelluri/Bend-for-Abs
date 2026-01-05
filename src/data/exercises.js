
const images = import.meta.glob('../assets/exercises/*.png', { eager: true });

const getImg = (name) => {
    const path = `../assets/exercises/${name}.png`;
    return images[path]?.default;
};

export const exercises = [
    {
        id: 'plank',
        name: 'Plank',
        description: 'Mantieni la posizione di push-up, mantenendo il corpo in linea retta.',
        defaultDuration: 30, // seconds
        image: getImg('plank')
    },
    {
        id: 'crunches',
        name: 'Crunch',
        description: 'Sdraiati sulla schiena, solleva le spalle dal pavimento usando gli addominali.',
        defaultDuration: 30,
        image: getImg('crunches'),
        image2: getImg('crunches-2')
    },
    {
        id: 'leg-raises',
        name: 'Sollevamento Gambe',
        description: 'Sdraiati sulla schiena, solleva le gambe fino a un angolo di 90 gradi.',
        defaultDuration: 30,
        image: getImg('leg-raises'),
        image2: getImg('leg-raises-2')
    },
    {
        id: 'bicycle-crunches',
        name: 'Crunch Bicicletta',
        description: 'Tocca il ginocchio opposto con il gomito mentre pedali con le gambe.',
        defaultDuration: 30,
        image: getImg('bicycle-crunches'),
        image2: getImg('bicycle-crunches-2')
    },
    {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        description: 'Porta le ginocchia al petto alternativamente in posizione di plank.',
        defaultDuration: 30,
        image: getImg('mountain-climbers'),
        image2: getImg('mountain-climbers-2')
    },
    {
        id: 'russian-twist',
        name: 'Russian Twist',
        description: 'Siediti a terra, inclinati leggermente indietro e ruota il busto da un lato all\'altro.',
        defaultDuration: 30,
        image: getImg('russian-twist'),
        image2: getImg('russian-twist-2')
    },
    {
        id: 'flutter-kicks',
        name: 'Flutter Kicks',
        description: 'Sdraiati sulla schiena e scalcia le gambe su e giù velocemente.',
        defaultDuration: 30,
        image: getImg('flutter-kicks'),
        image2: getImg('flutter-kicks-2')
    },
    {
        id: 'dead-bug',
        name: 'Dead Bug',
        description: 'Sdraiati sulla schiena, abbassa braccio e gamba opposti mantenendo il core contratto.',
        defaultDuration: 30,
        image: getImg('dead-bug'),
        image2: getImg('dead-bug-2')
    }
];

export const generateRoutine = (durationMinutes) => {
    const durationSeconds = durationMinutes * 60;
    const routine = [];
    let currentDuration = 0;

    // Simple logic: cycle through exercises until time is filled
    let i = 0;
    while (currentDuration < durationSeconds) {
        const ex = exercises[i % exercises.length];
        routine.push({
            ...ex,
            uniqueId: `${ex.id}-${i}`, // for key props
            duration: ex.defaultDuration
        });
        currentDuration += ex.defaultDuration;

        // Add rest if not last
        if (currentDuration < durationSeconds) {
            // 10 seconds rest
            routine.push({
                id: 'rest',
                name: 'Riposo',
                description: 'Riposati un attimo.',
                duration: 10,
                isRest: true,
                uniqueId: `rest-${i}`,
                image: getImg('rest')
            });
            currentDuration += 10;
        }

        i++;
    }

    return routine;
};
