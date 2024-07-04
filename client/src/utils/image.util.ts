import {UNDEFINED_DEFAULT_IMG} from "../../config/global.ts";

export function errorImage(e){
    e.target.src = UNDEFINED_DEFAULT_IMG;
}