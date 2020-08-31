import { useRecoilState } from 'recoil';
import { images } from './atoms';

export const changeItems = () => {
    const [items, setItems] = useRecoilState(images);
    return (newImages) => {
        if (newImages.length > 0) {
            setItems(newImages);
        }
    }
}