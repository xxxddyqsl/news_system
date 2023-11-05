import React, { useEffect } from 'react'
import styles from './Child.module.scss'
import axios from 'axios'
export default function Child() {
    const url = '/api/api/mmdb/movie/v3/list/hot.json?ct=%E8%8B%8F%E5%B7%9E&ci=80&channelId=4'
    useEffect(() => {
        axios({
            url: url,
            method: 'get',
        }).then(res => console.log(res))

        return () => {

        }
    }, [])

    return (
        <div>
            <ul>
                <li className={styles.item}>child-111</li>
            </ul>
        </div>
    )
}
