const response = await fetch(
	`https://api.github.com/repos/N0v0cain3/HowNodeWorks/commits`
);

const data = await response.json();
for (var i = 0; i < data.length; i++) {
	console.log(data[i].commit.message);
}
