const commentContainer = document.querySelector('.comments-container');

const deleteModal = document.querySelector('.delete-modal');


let userData;
let currentUser;

const xhttp = new XMLHttpRequest();

xhttp.onload = () => {

  if (xhttp.status === 200 && xhttp.readyState === 4) {

    userData = JSON.parse(xhttp.responseText);
    console.log(userData);

    currentUser = userData.currentUser;

    userData.comments.forEach(comment => {


      let html = commentMarkup(comment, currentUser.username);

      const userCommentMarkup = `
          <div class="user-comment">
            ${html}
          </div>
          `
      const userReplyMarkup = `
          <div class="user-replys">
          <div class="bar">qwerty</div>
            <div class="user-comment reply">
                ${html}
            </div>
          </div>
          `


      const commentCont = document.createElement('div');

      commentCont.classList.add('comment');

      commentCont.insertAdjacentHTML('beforeend', userCommentMarkup);

      const replys = document.createElement('div');
      if (comment.replies.length !== 0) {

        comment.replies.forEach((reply) => {

          console.log(comment.user.username)
          html = commentMarkup(reply, currentUser.username,comment.user.username);

          replys.classList.add('user-replys');

          replys.insertAdjacentHTML('beforeend', `         
          
                <div class="user-comment reply">
                    ${html}
                </div>
              ` );
        })
        replys.insertAdjacentHTML('afterbegin', `<div class="bar"></div>`);
        commentCont.insertAdjacentElement('beforeend', replys)
      }

      commentContainer.insertAdjacentElement('beforeend', commentCont)


    })

    const currentUserMarkup = `
      <div class="currentuser">
      <img src="${userData.currentUser.image.png}" alt="user">
      <textarea class="currentuser-comment" placeholder="Add a comment ..."></textarea>
      <div class="comment-send">Send</div>
    </div>
    `
    commentContainer.insertAdjacentHTML('beforeend', currentUserMarkup)

    const commentActions = document.querySelectorAll('.comment-actions');


    commentContainer.addEventListener('click', function event(e) {

      commentEvents(e.target);

      e.target.removeEventListener('click', event)
    })
    /*
    commentActions.forEach(actions => {

    })
    */

  }

}
xhttp.open('GET', './data.json')
xhttp.send();

function commentMarkup({ content, createdAt, score, user },currentUser,replyToUser) {
  const { username, image } = user;

  return `
    <div class="comment-vote">
      <img src="./images/icon-plus.svg" alt="upvote" class="upvote">
      <div class="vote-count">${score}</div>
      <img src="./images/icon-minus.svg" alt="downvote" class="downvote">

    </div>
    <div class="comment-details">

      <div class="comment-heading">
        <div class="user">
          <img src="${image.png}" alt="user">
          <span class=username> ${username}</span>
        </div>
        ${currentUser === username ? '<div id=you>You</div>' : ''}
        <div class="comment-date">
          ${createdAt}
        </div>
        <div class="comment-actions" >
          <div class="comment-reply" style=display:${currentUser === username ? 'none' : 'block'}>
          <img src="./images/icon-reply.svg" alt="reply">
            Reply
          </div>
          <div class="comment-edit" style="display:${currentUser === username ? 'block' : 'none'}">
            <img src="./images/icon-edit.svg" alt="edit">
            Edit

          </div>
          <div class="comment-delete" style="display:${currentUser === username ? 'block' : 'none'}">
          <img src="./images/icon-delete.svg" alt="delete">
            Delete
          </div>

        </div>

      </div>
      <p class="comment-description">
      ${replyToUser?`<span style=color:blue>${'@'+replyToUser} </span>`:''}${content}
      </p>
      ${currentUser === username ? '<div class=comment-update style=display:none >Update</div>' : ''}
    </div>`
}

function commentEvents(elem) {

  console.log(elem)

  if (elem.classList.contains('comment-edit') || elem.closest('.comment-edit')) {



    //console.log(e.target.closest('.comment-details').children[1])
    const commentUpdate = elem.closest('.comment-details').children[2];
    let commentDesc = elem.closest('.comment-details').children[1];
    const replyTo=commentDesc.innerText.split(" ")[0];


    commentDesc.textContent=commentDesc.textContent.replace(replyTo,"");

    commentDesc.toggleAttribute('contenteditable');
    commentDesc.style.border = '2px solid black';
    commentUpdate.style.display = 'block';

    elem.closest('.comment-heading').querySelector('.comment-edit').style.display='none';
    updateComment(commentDesc, commentUpdate,elem.closest('.comment-heading').querySelector('.comment-edit'),replyTo);

  }

  if (elem.classList.contains('comment-reply') || elem.closest('.comment-reply')) {

    const parentHeading=elem.closest('.comment-heading');

    console.log(elem.closest('.comment-heading').querySelector('.username').textContent)

    const replyToUser=parentHeading.querySelector('.username').innerText;

    const currentUserReplyMarkup = `
        <div class="currentuser">
        <img src="./images/avatars/image-${currentUser.username}.png" alt="user">
        <textarea class="currentuser-comment" placeholder='Add a comment ...'></textarea>
        <div class="currentuser-reply">Reply</div>
        </div>`

    elem.closest('.user-comment').insertAdjacentHTML('afterend', currentUserReplyMarkup);

    parentHeading.querySelector('.comment-reply').style.display='none';


    replyComment(elem.closest('.user-comment'),parentHeading.querySelector('.comment-reply'),replyToUser);

  }


  if (elem.classList.contains('comment-delete') || elem.closest('.comment-delete')) {
    console.log('delete');

    deleteModal.style.display = 'grid';

    deleteComment(elem.closest('.user-comment'));
  }

  if (elem.classList.contains('upvote')) {
    const voteCountElem = elem.closest('.comment-vote').querySelector('.vote-count');
    voteCountElem.textContent = +voteCountElem.textContent + 1;
  }

  if (elem.classList.contains('downvote')) {
    const voteCountElem = elem.closest('.comment-vote').querySelector('.vote-count');
    voteCountElem.textContent = +voteCountElem.textContent - 1;
  }


  if (elem.classList.contains('comment-send')) {
    console.log('send');

    console.log(elem.closest('.currentuser').querySelector('.currentuser-comment').value);

    const commentContent = elem.closest('.currentuser').querySelector('.currentuser-comment').value;

    const data = {
      content: commentContent,
      createdAt: '1 sec ago',
      score: 0,
      user: currentUser

    }
    const markup = `<div class="user-comment reply">
    ${commentMarkup(data, currentUser.username)}
    </div>
  `
    if (commentContent === '') {
      return;
    }
    elem.closest('.currentuser').insertAdjacentHTML('beforebegin', markup)
  }
}




function replyComment(elem,replyBtn,replyToUser) {

  console.log(replyBtn)

  elem.nextElementSibling.addEventListener('click', function send(e) {
    console.log(e.target);
    replyBtn.style.display='block';

    if (e.target.classList.contains('currentuser-reply')) {
      let commentContent = e.currentTarget.querySelector('.currentuser-comment').value;
      
      if (commentContent === '') {
        e.currentTarget.remove();
        return;
      }

      const data = {
        content: commentContent,
        createdAt: '1 sec ago',
        score: 0,
        user: currentUser

      }
      const markup = `<div class="user-comment reply" style='align-items:stretch'>
      ${commentMarkup(data, currentUser.username,replyToUser)}
      </div>

    `
      elem.insertAdjacentHTML('afterend', markup);

      e.currentTarget.remove();

    }
  })
}





function deleteComment(elem) {

  document.querySelector('.confirm-delete').addEventListener('click', function deleteElem(e) {
    console.log(e.target)

    if (e.target.classList.contains('delete-yes')) {

      console.log(elem)
      elem.remove();
    }
    deleteModal.style.display = '';

    e.currentTarget.removeEventListener('click', deleteElem);

  })

}







function updateComment(elem, updateBtn,replyBtn,replyTo) {

  updateBtn.addEventListener('click', function update(e) {

    console.log(replyTo);


    elem.toggleAttribute('contenteditable');
    elem.style.border = '2px solid transparent';

    elem.innerHTML = `<span style=color:blue>${replyTo} </span>${elem.textContent}`

    updateBtn.style.display = 'none';
    replyBtn.style.display='block';

    updateBtn.removeEventListener('click', update);
  })
}