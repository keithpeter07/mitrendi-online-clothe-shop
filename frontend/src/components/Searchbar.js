const SearchBar = props => {
    return(
        <div className="text-center mt-1" style={{maxWidth: '100%', justifyContent: 'center', marginLeft: '-1em'}}>
            <input className="px-2 searchbar ms-3" type="text" placeholder="search" onChange={event => props.setSearchWord(event.target.value)}/>
        </div>
    )
}




export default SearchBar