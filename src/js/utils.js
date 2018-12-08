/* Dependencies */
import { 
    shuffle,
    concat
} from 'lodash'

// doubled shuffled cards array
export const shuffledCards = () => {
    let imageList = [
        'art-monster', 'black-monster', 'blue-monster', 'boggs-monster', 'carrie-monster', 'chet-monster',
        'cute-blue-monster', 'johnny-monster', 'referee-monster', 'sick-monster', 'snail-monster', 'squishy-monster'
    ]
    return shuffle(concat(shuffle(imageList), shuffle(imageList)))
}
