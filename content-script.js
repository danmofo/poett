"use strict";

// Create UI
let div = document.createElement('div');
div.id = 'root';
div.innerHTML = "Hello world.";

// Insert
let content = document.querySelector('#content');
let parent = document.querySelector('#main > .large-12.columns');
let modHeader = document.querySelector('#prop-mods h5')
parent.insertBefore(div, content);


function dom(elementName, opts, ...children) {
	console.log(arguments)
	let frag = document.createElement(elementName);
	for(let key in opts) {
		frag[key] = opts[key];
	}
	for(let child in children) {
		frag.appendChild(child);
	}
	return frag;
}

modHeader.appendChild(dom('button', {
	onclick: function() {
		console.log('Clicked button on mod header')
	},
	textContent: 'Save thid ModSet'
}));

var STORAGE_MODSETS = "modsets";

class Application {
	constructor(storage) {
		this.storage = storage;
		this.modSets = [];
		this.loadExisting(() => {
			console.log('Mod sets loaded - ', this.modSets);
			this.augmentUi();
		});
	}

	// Load any existing data saved locally
	loadExisting(callback) {
		this.storage.get(STORAGE_MODSETS, (data) => {
			var modSets = data[STORAGE_MODSETS];
			if(!modSets) {
				console.log('No mod sets were found.');
			} else {
				console.log('Found modsets.');
				this.modSets = modSets;
			}
			callback();
		})
	}

	// Build all of our HTML
	buildTemplates() {
		var wrapper = dom('div', {className: 'foo'});
		var p = dom('p', {textContent: 'foobar'});


		// let wrapper = dom('div', {
		// 	id: 'wrapper'
		// });
		// for(let mod of this.modSets) {
		// 	wrapper.appendChild(
		// 		dom('div', {
		// 			'textContent': mod.name()
		// 		})
		// 	)
		// }
		// console.log(wrapper.outerHTML);
	}

	// Augment the UI, adding our own elements
	augmentUi() {
		this.buildTemplates();
	}
}

class Storage {
	constructor(provider) {
		this.provider = provider;
	}

	get(key, cb) {
		this.provider.get([key], cb);
	}

	set(key, value, cb) {
		var data = {};
		data[key] = value;
		this.provider.set(data, cb);
	}
}

class ModSet {
	constructor(name) {
		this.mods = []
		this.name = name;
	}

	add(modName) {
		this.mods.push(modName)
	}

	remove(modName) {
		var idx = this.mods.indexOf(modName);
		if(idx > -1)  {
			this.mods.splice(idx, 1);	
		}
	}

	toString() {
		return "[ModSet name=" + name + "]";
	}
}

let modSet = new ModSet("My mod set name 1");
modSet.add("Mod name");
modSet.add("Mod name dsds");
modSet.add("fdsfsdkjfjk");

console.log(modSet)

let storage = new Storage(chrome.storage.local);
let app = new Application(storage);