import { atom } from 'recoil';

export const images = atom({
    key: 'images',
    default: [],
});

export const croppedImages = atom({
    key: 'croppedImages',
    default: [],
});

export const doCropImages = atom({
    key: 'doCropImages',
    default: false,
});

export const countImages = atom({
    key: 'countImages',
    default: 0,
});