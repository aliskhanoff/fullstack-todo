import { useRef, useState } from "react";
import { BiMenu, BiMenuAltLeft } from "react-icons/bi";
import { useMutation } from 'react-query'
import axios from 'axios';

export interface IBoardHeaderProps {
    name: string
    uid: string
}

export const BoardHeader = (props: IBoardHeaderProps) => {

    const editorRef = useRef<HTMLInputElement | null>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [header, setHeader] = useState(props.name);



    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className='px-2 py-3 flex justify-between'>
            {isEditing &&
                
                (<form  
                onSubmit={(form) => {
                    form.preventDefault();
                    setIsEditing(false)
                }}>    
                <input name="new_todo" autoFocus ref={editorRef} onBlur={() => setIsEditing(false)} className='outline-none ring-1 ring-slate-600 py-1 rounded-sm px-2' type='text' />
            </form>)}

            { !isEditing && (<h1 onDoubleClick={ () => setIsEditing(true) } className="font-semibold">{header}</h1>) }
            <i className="text-lg">
                {!isMenuOpen && (<BiMenu onClick={ () => setIsMenuOpen(!isMenuOpen) } className='text-xl' />)}
                {isMenuOpen && (<BiMenuAltLeft onClick={ () => setIsMenuOpen(!isMenuOpen) } className='text-xl' />)}
            </i>
      </div>
    )
}

export default BoardHeader