class CreateElements{
   constructor(){
      this.body = document.body;
      this.body.style.textAlign = 'center';
      this.body.style.backgroundColor = '#c4c4c4';

      this.build = document.querySelector('.build');
      this.build.style.marginTop = 62 + 'px';
      this.build.style.marginLeft = 'auto';
      this.build.style.marginRight = 'auto';
      this.build.style.width = 500 + 'px';

      this.input = this.createElement('input', 'input');
      this.input.style.width = 500 + 'px';
      this.input.style.height = 62 + 'px';
      this.input.style.fontSize = 48 + 'px';
      this.input.style.paddingLeft = 13 + 'px';
      this.input.style.outline = 'none';
      this.input.style.border = 'none';
      this.build.append(this.input);
      
      this.ul = this.createElement('ul', 'list');
      this.ul.style.width = 100 + '%';
      this.ul.style.height = 100 + '%';  
      this.ul.style.backgroundColor = '#E3E3E3';
      this.input.insertAdjacentElement('afterEnd', this.ul);

      this.div = this.createElement('div', 'itemList');
      this.div.style.width = 600 +'px';
      this.div.style.marginTop = 45 +'px';
      this.build.append(this.div);       
   }

   createElement(element, classElement){
      const newElement = document.createElement(element);
      if(classElement){
         newElement.classList.add(classElement);
      }
      return newElement;
   }

   createRepositories(repository){    
      const createRepository = this.createElement('div', 'item');
      createRepository.style.display ='flex';
      createRepository.style.justifyContent ='space-between';
      createRepository.style.width = 500 +'px';
      createRepository.style.backgroundColor = '#E27BEB';
      createRepository.style.border = '1px solid black';      
      createRepository.innerHTML = `
                                    <div style="margin-top: 5px; margin-left: 16px; font-size: 24px; text-align: left;">
                                       <div>Name: ${repository.name}</div>
                                       <div>Owner: ${repository.owner.login}</div>      
                                       <div>Stars: ${repository.stargazers_count}</div>  
                                    </div>    
                                    <button class="${repository.id}" style="font-size: 80px; color: red; border: none; background-color: transparent; margin-top: 5px; margin-right: 50px; cursor: pointer">X</button>
      `;      
      this.div.append(createRepository);
      
      this.deleteDiv(repository.id);
   }

   viewRepositories(name){
      if(name.language == null) return;
      const nameLanguage = this.createElement('li', 'liLanguage');
      nameLanguage.style.fontSize = 30 + 'px';
      nameLanguage.style.border = '1px solid black';  
      nameLanguage.style.textAlign = 'left';  
      nameLanguage.style.listStyleType = 'none';  
      nameLanguage.style.cursor = 'pointer';  
      nameLanguage.innerHTML = `<span class="${name.id}" style="margin-left: 13px; margin-bottom: 10px; display: block">${name.name}</span>`;
      this.ul.append(nameLanguage);      
   }   

   clickedLi(item){       
      this.ul.addEventListener('click', (e) => {
         if(e.target.classList.value == item.id){
            this.createRepositories(item);
         }                  

         this.ul.innerHTML = '';
      });
   }

   deleteDiv(item){
      const itemList = document.querySelectorAll('button');
      for(let i = 0; i < itemList.length; i++){
         itemList[i].addEventListener('click', (e) => {
            if(e.target.classList.value == item){
               itemList[i].parentElement.remove();       
            }
         })
      }
   }
}

const REPOSITORI_PAGE = 5;

class Search {
   constructor(createElement){
      this.createElement = createElement;
      
      this.createElement.input.addEventListener('keyup', this.debounce(this.serchRepositories.bind(this), 500));
   }

   async serchRepositories(){
      let createElementValue  = this.createElement.input.value;
      if(createElementValue){
         try{
            this.clearRepository();
            return await fetch(`https://api.github.com/search/repositories?q=${this.createElement.input.value}&per_page=${REPOSITORI_PAGE}`)
            .then((res) => {          
               res.json().then(res => {
                  console.log(res);
                  res.items.forEach(item => this.createElement.viewRepositories(item));
                  res.items.forEach(item => this.createElement.clickedLi(item));
               })        
            })
         } catch(e){
            console.log('Error: ' + e);
         }
      } else {
         this.clearRepository();
      }

   }

   clearRepository(){
      this.createElement.ul.innerHTML = ' ';
   }

   debounce(func, wait, immediate){
      let timeout;
      return function(){
         const context = this, args = arguments;
         const later = function(){
            timeout = null;
            if(!immediate) func.apply(context, args);
         };
         const callNow = immediate && !timeout;
         clearTimeout(timeout);
         timeout = setTimeout(later, wait);
         if(callNow) func.apply(context, args);
      };
   }
}

new Search(new CreateElements());