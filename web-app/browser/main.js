import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

const sidebar_columns = Tetris.sidebar_width;
const sidebar_rows = Tetris.sidebar_height;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const sidebar = document.getElementById("sidebar");

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const sidebar_cells = range(sidebar_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(sidebar_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    sidebar.append(row);
    return rows;
})

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const update_grid = function () {
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordinates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );

            } catch (ignore) {

            }
        }
    );
    
    sidebar_cells.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = sidebar_cells[line_index][column_index];
            cell.className = `cell`;
        });
    });

    game.next_tetromino.grid.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = sidebar_cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key == "c"){
        game = Tetris.hold(game);
    }
    update_grid();
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_grid();
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);

update_grid();
