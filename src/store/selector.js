import { selector } from 'recoil';
import { images } from './atoms';

export const imagesState = selector({
    key: 'imagesState',
    get: ({ get }) => {
        const totalImages = get(images).lenght;
        return {
            totalImages
        }
    }
});