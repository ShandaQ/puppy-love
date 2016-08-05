create table owner (
  id serial primary key,
  uername varchar unique not null,
  pswd varchar not null,
  email varchar not null,
  location_zip varchar not null
);

create table pups (
  id serial primary key,
  name varchar not null,
  age integer not null,
  breed varchar not null,
  litters varchar,
  gender char not null,
  owner_id integer references owner (id)
);

create table loveConnection (
  id serial primary key,
  f_pup_id varchar references pups (id),
  m_pup varchar references pups (id)
);

INSERT INTO owner VALUES
  (DEFAULT,'shandaq', 'test1', 'shandaq@gmail.com', '30341');

INSERT INTO owner VALUES
  (DEFAULT,'kennedy', 'test1', 'kennedy@gmail.com', '30341');

INSERT INTO pups VALUES
  (DEFAULT, 'MJ Simba', '3', 'dachshund', 'n/a', 'm', '1');

INSERT INTO pups VALUES
  (DEFAULT, 'Nala', '4', 'dachshund', '0', 'f', '2');

INSERT INTO pups VALUES
  (DEFAULT, 'Princess', '3', 'bulldog', '1', 'f', '1');

INSERT INTO loveConnection VALUES
  (DEFAULT, '2', '1')
