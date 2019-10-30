var app = new Vue({
    el: '#app',
    data: {
        modal: "",
        notes:{
            misc: [
                {
                    title: "These Are Example Notes",
                    content: "You can edit these notes, delete, them or create new notes."
                },
                {
                    title: "New Note",
                    content: "You can either click the 'New Note +' button on the bottom right of the page or click a category name to add a new note to that category."
                },
                {
                    title: "Drag & Drop",
                    content: "You can drag and drop notes between categories."
                },
                {
                    title: "Searching",
                    content: "You can filter your notes with the search box in the top right."
                },
                {
                    title: "Saving",
                    content: "Your notes will automatically save to your browser's local storage."
                },
                {
                    title: "Links",
                    content: "Notes can have links assigned to them. This is useful for storing bookmarks to sites. Try clicking the link icon on the top of this note.",
                    link:"https://matdombrock.com"
                },
                {
                    title: "To Foreign Lands",
                    content: `I heard that you ask’d for something to prove this puzzle the New World,
And to define America, her athletic Democracy,
Therefore I send you my poems that you behold in them what you wanted.
                    `,
                    link: "https://whitmanarchive.org/published/LG/1881/poems/5"
                },
                {
                    title: "Song To Myself",
                    content: `I CELEBRATE myself, and sing myself,

And what I assume you shall assume,
For every atom belonging to me as good belongs to you.

I loafe and invite my soul,
I lean and loafe at my ease observing a spear of summer grass.

My tongue, every atom of my blood, form'd from this soil, this 
air,
Born here of parents born here from parents the same, and their 
parents the same,
I, now thirty-seven years old in perfect health begin,
Hoping to cease not till death.

Creeds and schools in abeyance,
Retiring back a while sufficed at what they are, but never forgotten,
I harbor for good or bad, I permit to speak at every hazard,
Nature without check with original energy.
                    `,
                    link:"https://www.poetryfoundation.org/poems/45477/song-of-myself-1892-version"
                },
                {
                    xtitle: "note 3",
                    content: `When I heard the learn’d astronomer,
When the proofs, the figures, were ranged in columns before me,
When I was shown the charts and diagrams, to add, divide, and measure them,
When I sitting heard the astronomer where he lectured with much
applause in the lecture-room, [...]
                    `,
                },
            ],
            todo: [
                {
                    title: "Defeat Bowser",
                    content: "He's ran off with Peach again. It's the third time this week!",
                    link:"https://nintendo.com"
                },
                {
                    title: "Groceries",
                    content: `-Bananas
                    -Kool-Aid
                    -Bread`,
                },
                {
                    title: "Change Category Names",
                    content: "It would be useful if the category names could easily be changed.",
                },
                {
                    title: "Click Category Names To Create New Note",
                    content: "It would be useful if the category names could be clicked to create a new note in that category.",
                },
                {
                    title: "Add option for links.",
                    content: "Notes should have an option to include a URL.",
                },
                {
                    title: "Change note category.",
                    content: "When editing/creating a note it should be possible to change it's category from the edit screen.",
                },
                {
                    title: "Search.",
                    content: "Add a simple search filter feature.",
                },
            ],
            ideas: [
                {
                    title: "Street View",
                    content: 'Somebody at google was just like "yea, just have someone drive down every road on earth".',
                },
                {
                    title: "Lemonade?",
                    content: 'Apparently, a lemon is not naturally occurring and is a hybrid developed by cross breeding a bitter orange and a citron. Life never gave us lemons; we invented them all by ourselves.',
                },
            ],
        }, 
        filteredNotes: {},
        drag: false, 
        state:{
            currentNote:{
                category: "misc",
                index:-1,
            },
            searchQuery:"",
        } 
    },
    async mounted(){
        await this.loadNotes();
        await this.searchNotes();
        this.filteredNotes.misc.push();// hack to fix rendering issue 
    },
    methods:{
        saveNotes: function(){
            console.log("Saving Notes...");
            localStorage.setItem('notes',JSON.stringify(this.notes));
            console.log('Saved Notes!');
        },
        loadNotes: function(){
            var loadedNotes = localStorage.getItem('notes');
            if(loadedNotes!=null){
                this.notes = JSON.parse(loadedNotes);
                console.log('Loaded Notes!');
            }else{
                console.log('No Notes To Load, Using Defaults!');
            }
        },
        deleteNote: function(category, index, auto){
            if(auto==true){
                this.notes[category].splice(index,1);
                return;
            }
            if (confirm('Are you sure you want to delete this note?')) {
                this.notes[category].splice(index,1);
            } else {
                // Do nothing!
            }   
        },
        newNote: async function(category="misc"){
            console.log("newnote");
            //
            await this.notes[category].unshift(
                {
                    title: "New Note",
                    content: "New Content",
                    link:null,
                }
            );
            this.state.currentNote.index = 0;
            this.state.currentNote.category = category;
            this.modal = "newNote";
        },
        editNote: function(category,index){
            console.log("editnote");
            this.state.currentNote.index = index;
            this.modal = "newNote";
            this.state.currentNote.category = category;
        },
        closeModal: function(){
            this.modal = "";
            this.saveNotes();
        },
        activateLink: function(){
            if(this.notes[this.state.currentNote.category][this.state.currentNote.index].link==null || this.notes[this.state.currentNote.category][this.state.currentNote.index].link=="")
            {
                this.notes[this.state.currentNote.category][this.state.currentNote.index].link = "https://";
                document.getElementById("custom-input-link").focus();
            }
            else
            {
                this.notes[this.state.currentNote.category][this.state.currentNote.index].link = "";
            }
        },
        switchNoteGroup: function(category){
            console.log("switch note group to "+category);
            //cache note
            var noteCache = this.notes[this.state.currentNote.category][this.state.currentNote.index];
            //delete note
            this.deleteNote(this.state.currentNote.category, this.state.currentNote.index, true);
            //add to new category
            this.notes[category].unshift(noteCache);
            //assign new note as current note
            this.state.currentNote.category = category;
            this.state.currentNote.index = 0;
            this.saveNotes();
        },
        searchNotes: function(){
            //depreciated
            console.log("SEARCH: "+this.state.searchQuery);
            if(this.state.searchQuery == "" || this.state.searchQuery == null){
                console.log("Empty Query");
                this.filteredNotes.misc = this.notes.misc;
                this.filteredNotes.todo = this.notes.todo;
                this.filteredNotes.ideas = this.notes.ideas;
                return;
            }
            var results = [];
            
            var miscResults = this.searchNoteCategory("misc");
            var todoResults = this.searchNoteCategory("todo");
            var ideasResults = this.searchNoteCategory("ideas");

            this.filteredNotes.misc = miscResults;
            this.filteredNotes.todo = todoResults;
            this.filteredNotes.ideas = ideasResults;

        },
        searchNoteCategory: function(category){
            //depreciated
            //console.log("Searching: "+category);
            var results = [];
            var searchArray = this.state.searchQuery.split(" ");
            //console.log("search array: "+searchArray);
            this.notes[category].forEach(function(note){
                var passed = false;
                var noteString = note.title+" "+note.content+" "+note.link;
                //console.log("note-string: "+noteString);
                searchArray.forEach(function(searchWord){
                    if(noteString.toLowerCase().includes(searchWord.toLowerCase())){
                        passed = true;
                        console.log(searchWord.toLowerCase());
                        //console.log("PASSED")
                    }
                });

                if(passed==true){
                    results.push(note)
                }
            });
            return results;
        },
        searchNote(note){
            //the real search function
            //searches each note locally instead of in a group
            var searchArray = this.state.searchQuery.split(" ");
            var noteString = note.title+" "+note.content+" "+note.link;
            var passed = false;
            searchArray.forEach(function(searchWord){
                if(noteString.toLowerCase().includes(searchWord.toLowerCase())){
                    passed = true;
                    if(searchWord != ''){
                        console.log(searchWord.toLowerCase());
                    }
                    
                    //console.log("PASSED")
                }
            });
            return passed;
        },
        clearSearch: function(){
            this.state.searchQuery = "";
            this.searchNotes();
        },
        test: function(){
            alert();   
        }
    }
  
})