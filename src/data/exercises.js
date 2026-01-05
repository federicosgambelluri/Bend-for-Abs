
import plankImg from '../assets/exercises/plank.png';
import crunchesImg from '../assets/exercises/crunches.png';
import crunchesImg2 from '../assets/exercises/crunches-2.png';
import legRaisesImg from '../assets/exercises/leg-raises.png';
import legRaisesImg2 from '../assets/exercises/leg-raises-2.png';
import bicycleCrunchesImg from '../assets/exercises/bicycle-crunches.png';
// import bicycleCrunchesImg2 from '../assets/exercises/bicycle-crunches-2.png'; // Missing
import mountainClimbersImg from '../assets/exercises/mountain-climbers.png';
// import mountainClimbersImg2 from '../assets/exercises/mountain-climbers-2.png'; // Missing
import russianTwistImg from '../assets/exercises/russian-twist.png';
// import russianTwistImg2 from '../assets/exercises/russian-twist-2.png'; // Missing
import flutterKicksImg from '../assets/exercises/flutter-kicks.png';
// import flutterKicksImg2 from '../assets/exercises/flutter-kicks-2.png'; // Missing
import deadBugImg from '../assets/exercises/dead-bug.png';
// import deadBugImg2 from '../assets/exercises/dead-bug-2.png'; // Missing
import restImg from '../assets/exercises/rest.png';

export const exercises = [
    {
        id: 'plank',
        name: 'Plank',
        description: 'Mantieni la posizione di push-up, mantenendo il corpo in linea retta.',
        defaultDuration: 30, // seconds
        image: plankImg
    },
    {
        id: 'crunches',
        name: 'Crunch',
        description: 'Sdraiati sulla schiena, solleva le spalle dal pavimento usando gli addominali.',
        defaultDuration: 30,
        image: crunchesImg,
        image2: crunchesImg2
    },
    {
        id: 'leg-raises',
        name: 'Sollevamento Gambe',
        description: 'Sdraiati sulla schiena, solleva le gambe fino a un angolo di 90 gradi.',
        defaultDuration: 30,
        image: legRaisesImg,
        image2: legRaisesImg2
    },
    {
        id: 'bicycle-crunches',
        name: 'Crunch Bicicletta',
        description: 'Tocca il ginocchio opposto con il gomito mentre pedali con le gambe.',
        defaultDuration: 30,
        image: bicycleCrunchesImg
        // image2: bicycleCrunchesImg2
    },
    {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        description: 'Porta le ginocchia al petto alternativamente in posizione di plank.',
        defaultDuration: 30,
        image: mountainClimbersImg
        // image2: mountainClimbersImg2
    },
    {
        id: 'russian-twist',
        name: 'Russian Twist',
        description: 'Siediti a terra, inclinati leggermente indietro e ruota il busto da un lato all\'altro.',
        defaultDuration: 30,
        image: russianTwistImg
        // image2: russianTwistImg2
    },
    {
        id: 'flutter-kicks',
        name: 'Flutter Kicks',
        description: 'Sdraiati sulla schiena e scalcia le gambe su e giù velocemente.',
        defaultDuration: 30,
        image: flutterKicksImg
        // image2: flutterKicksImg2
    },
    {
        id: 'dead-bug',
        name: 'Dead Bug',
        description: 'Sdraiati sulla schiena, abbassa braccio e gamba opposti mantenendo il core contratto.',
        defaultDuration: 30,
        image: deadBugImg
        // image2: deadBugImg2
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
                image: restImg
            });
            currentDuration += 10;
        }

        i++;
    }

    return routine;
};
