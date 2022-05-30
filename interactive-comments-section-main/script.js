const commentContainer = document.querySelector('.comments-container');

const deleteModal = document.querySelector('.delete-modal');


let userData;
let currentUser;

const xhttp = new XMLHttpRequest();

xhttp.onload = () => {

  if (xhttp.status === 200 && xhttp.readyState === 4) {

    userData = JSON.parse(xhttp.responseText);

    currentUser = userData.currentUser;

    userData.comments.forEach(comment => {


      let html = commentMarkup(comment, currentUser.username);

      const userCommentMarkup = `
          <div class="user-comment">
            ${html}
          </div>`;

      const commentCont = document.createElement('div');

      commentCont.classList.add('comment');

      commentCont.insertAdjacentHTML('beforeend', userCommentMarkup);

      const replys = document.createElement('div');
      if (comment.replies.length !== 0) {

        comment.replies.forEach((reply) => {

          html = commentMarkup(reply, currentUser.username, comment.user.username);

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

  }

}
xhttp.open('GET', './data.json')
xhttp.send();

function commentMarkup({ content, createdAt, score, user }, currentUser, replyToUser) {
  const { username, image } = user;

  return `
    <div class="comment-vote">
      <img src="./images/icon-plus.svg" alt="upvote" class="upvote">
      <div class="vote-count">${score}</div>
      <img src="./images/icon-minus.svg" alt="downvote" class="downvote">

    </div>
    
      <div class="comment-heading">
        <div class="user">
          <img src="${image.png}" alt="user">
          <span class=username> ${username}</span>
        </div>
        ${currentUser === username ? '<div id=you>You</div>' : ''}
        <div class="comment-date">
          ${createdAt}
          </div>
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

      <p class="comment-description">
        ${replyToUser ? `<span style=color:blue>${'@' + replyToUser} </span>` : ''}${content}
      </p>
        ${currentUser === username ? '<div class=comment-update style=display:none >Update</div>' : ''}
    `
}

function commentEvents(elem) {


  if (elem.classList.contains('comment-edit') || elem.closest('.comment-edit')) {

    const parentComment = elem.closest('.user-comment');

    const commentAction = parentComment.querySelector('.comment-actions');
    const commentUpdate = parentComment.querySelector('.comment-update');
    let commentDesc = parentComment.querySelector('.comment-description');
    const replyTo = commentDesc.innerText.split(" ")[0];


    commentDesc.textContent = commentDesc.textContent.replace(replyTo, "");

    commentDesc.toggleAttribute('contenteditable');
    commentDesc.style.border = '2px solid hsl(238, 40%, 52%)';
    commentUpdate.style.display = 'block';

    commentAction.querySelector('.comment-edit').style.display = 'none';
    updateComment(commentDesc, commentUpdate, commentAction.querySelector('.comment-edit'), replyTo);

  }

  if (elem.classList.contains('comment-reply') || elem.closest('.comment-reply')) {

    const parentComment = elem.closest('.user-comment');




    const replyToUser = parentComment.querySelector('.username').innerText;

    const currentUserReplyMarkup = `
        <div class="currentuser">
        <img src="./images/avatars/image-${currentUser.username}.png" alt="user">
        <textarea class="currentuser-comment" placeholder='Add a comment ...'></textarea>
        <div class="currentuser-reply">Reply</div>
        </div>`

    parentComment.insertAdjacentHTML('afterend', currentUserReplyMarkup);

    parentComment.querySelector('.comment-reply').style.display = 'none';


    replyComment(parentComment, parentComment.querySelector('.comment-reply'), replyToUser);

  }


  if (elem.classList.contains('comment-delete') || elem.closest('.comment-delete')) {

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

    const parentComment = elem.closest('.currentuser');
    const commentContent = parentComment.querySelector('.currentuser-comment').value;

    parentComment.querySelector('.currentuser-comment').value = '';

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
    if (commentContent !== '') {
      parentComment.insertAdjacentHTML('beforebegin', markup)
    }
  }
}




function replyComment(elem, replyBtn, replyToUser) {


  elem.nextElementSibling.addEventListener('click', function send(e) {

    if (e.target.classList.contains('currentuser-reply')) {
      let commentContent = e.currentTarget.querySelector('.currentuser-comment').value;

      if (commentContent === '') {
        e.currentTarget.remove();
        replyBtn.style.display = 'block';

        return;
      }

      const data = {
        content: commentContent,
        createdAt: '1 sec ago',
        score: 0,
        user: currentUser

      }
      const markup = `<div class="user-comment reply" style='align-items:stretch'>
      ${commentMarkup(data, currentUser.username, replyToUser)}
      </div>

    `
      elem.insertAdjacentHTML('afterend', markup);
      e.currentTarget.remove();
      replyBtn.style.display = 'block';

    }
  })
}





function deleteComment(elem) {

  document.querySelector('.confirm-delete').addEventListener('click', function deleteElem(e) {

    if (e.target.classList.contains('delete-yes')) {

      elem.remove();
    }
    deleteModal.style.display = '';

    e.currentTarget.removeEventListener('click', deleteElem);

  })

}







function updateComment(elem, updateBtn, replyBtn, replyTo) {

  updateBtn.addEventListener('click', function update(e) {



    elem.toggleAttribute('contenteditable');
    elem.style.border = '2px solid transparent';

    if (elem.innerText === '') {
      elem.closest('.user-comment').remove();
      return;

    }

    elem.innerHTML = `<span style=color:blue>${replyTo} </span>${elem.textContent}`

    updateBtn.style.display = 'none';
    replyBtn.style.display = 'block';
    updateBtn.removeEventListener('click', update);

  })
}