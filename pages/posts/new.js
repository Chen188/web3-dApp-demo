import "easymde/dist/easymde.min.css"

import { useState, useRef, useMemo } from "react"
import dynamic from 'next/dynamic'
import { ethers } from 'ethers'

import { formIpfsUrl, getIpfsClient } from '../../lib/utils'
import CreatePostLayout from "../../layouts/create-post-layout"

import Blog from '../../artifacts/contracts/Blog.sol/Blog.json'

/* import contract address */
import { contractAddress } from '../../config'

/* define the ipfs endpoint */
const ipfsClient = getIpfsClient()

/* configure the markdown editor to be client-side import */
const SimpleMDE = dynamic(
    () => import('react-simplemde-editor'),
    { ssr: false }
)

const initialState = { title: '', content: '' }

export default function NewPost() {
    /* configure initial state to be used in the component */
    const [post, setPost] = useState(initialState)
    const [image, setImage] = useState(null)
    const [uploadingCoverImage, setUploadingCoverImage] = useState(false)
    const [savingPost, setSavingPost] = useState(false)

    const fileRef = useRef(null)
    const { title, desc, content } = post

    async function createNewPost() {
        /* saves post to ipfs then anchors to smart contract */
        if (!title || !desc || !content) return

        setSavingPost(true)
        const hash = await savePostToIpfs()
        await savePost(hash)
        setSavingPost(false)

        router.push(`/`)
    }

    async function savePostToIpfs() {
        /* save post metadata to ipfs */
        try {
            console.log(post)
            const added = await ipfsClient.add(JSON.stringify(post))
            return added.path
        } catch (err) {
            console.log('error: ', err)
        }
    }

    async function savePost(hash) {
        /* anchor post to smart contract */
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
            console.log('contract: ', contract)
            try {
                const val = await contract.createPost(post.title, post.desc, hash)
                /* optional - wait for transaction to be confirmed before rerouting */
                /* await provider.waitForTransaction(val.hash) */
                console.log('val: ', val)
                alert('Create Success')
            } catch (err) {
                console.log('Error: ', err)
            }
        }
    }

    async function onUploadClick() {
        /* upload cover image to ipfs and save hash to state */
        const fileElement = document.getElementById('ipt-cover-image')
        const uploadedFile = fileElement.files[0]
        if (!uploadedFile) return

        setUploadingCoverImage(true)

        const added = await ipfsClient.add(uploadedFile)
        setPost(state => ({ ...state, coverImage: added.path }))
        setImage(added.path)
        console.log(added.path)

        setUploadingCoverImage(false)
        // todo: delete
        // setPost(state => ({ ...state, coverImage: 'QmeisUNzsWHmjmD8hX3mGsC8sYiYYwx2Qif98bHJPBvQsG' }))
        // setImage('QmeisUNzsWHmjmD8hX3mGsC8sYiYYwx2Qif98bHJPBvQsG')
    }

    function onChangeImageClick() {
        setImage(null)
    }

    const noSpellcheckerOptions = useMemo(() => {
        return {
            spellChecker: false,
        };
    }, []);

    return (
        <>
            <header className='masthead' style={{ backgroundImage: image ? `url(${formIpfsUrl(image)})` : 'unset' }}>
                <div className="container position-relative px-4 px-lg-5">
                    <div className="row gx-4 gx-lg-5 justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-7">
                            {
                                !image ? <form>
                                    <div className="form-group">
                                        <label htmlFor="ipt-cover-image" className="label-cover-image">Upload cover image: </label>
                                        <input
                                            type="file"
                                            className="form-control form-control-lg"
                                            id="ipt-cover-image"
                                            name="cover-image"
                                            ref={fileRef} />
                                    </div>
                                    <div className="form-group">
                                        <button
                                            type='button'
                                            className="btn btn-primary btn-lg"
                                            onClick={onUploadClick}
                                            disabled={uploadingCoverImage ? 'disabled' : ''}
                                            id="btn-upload-cover-image">
                                            Upload {uploadingCoverImage ? '...' : ''}
                                        </button>
                                    </div>
                                </form> :
                                    <div className="text-center">
                                        <button
                                            type='button'
                                            className="btn btn-success btn-lg"
                                            onClick={onChangeImageClick}>
                                                Change Image
                                        </button>
                                    </div>
                            }

                        </div>
                    </div>
                </div>
            </header>
            <div className="container px-4 px-lg-5">
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            onChange={e => setPost({ ...post, title: e.target.value })}
                            type="text" className="form-control" id="title" placeholder="" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="desc" className="form-label">Description</label>
                        <input
                            onChange={e => setPost({ ...post, desc: e.target.value })}
                            type="text" className="form-control" id="desc" placeholder="" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Post body</label>
                        <small className="form-text text-muted"> (Markdown syntex is supported.)</small>

                        <SimpleMDE
                            options={noSpellcheckerOptions}
                            onChange={value => setPost({ ...post, content: value })}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        disabled={savingPost ? 'disabled' : ''}
                        onClick={createNewPost}>
                        {savingPost ? 'Saving Post...' : 'Save Post'}
                    </button>
                </form>

                <p></p>
            </div>
        </>
    )
}

NewPost.getLayout = function getLayout(page) {
    return (
        <CreatePostLayout>
            {page}
        </CreatePostLayout>
    )
}