import React from 'react';
import { useState } from 'react';
import {
  Grid,
  InputLabel,
  Input,
  IconButton,
  InputAdornment,
  FormControl,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles/topicsNav.module.css';

const Topicsnavbar = (props) => {
  const searchItems = ['Tech', 'Math', 'Development', 'Cloud', 'Newbie', 'DSA'];
  const { setSearchString } = props;
  const [clickIdx, setclickIdx] = useState(-1);

  const handleClick = (searchItem, idx) => {
    // If Search Tag Already Clicked
    if (clickIdx === idx) {
      setclickIdx(-1);
      setSearchString('');
      return;
    }

    setclickIdx(idx);
    const finalString = searchItem + '#';
    setSearchString(finalString);
  };

  const handleSearchChange = (event) => {
    setSearchString(event.target.value);
  };

  return (
    <>
      <div className="navbarContainer">
        <Grid container spacing={2} alignItems="center">
          <Grid item lg={2} sm={2}>
            <p className="firstItem">Latest Articles</p>
          </Grid>
          <Grid item lg={7} sm={8}>
            <Grid className="secondItem" container spacing={1}>
              {searchItems.map((searchItem, idx) => {
                return (
                  <Grid item key={idx}>
                    <Button
                      onClick={() => handleClick(searchItem, idx)}
                      className={clickIdx === idx ? styles.buttonSelected : styles.buttonDefault}
                    >
                      {searchItem}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid className="thirdItem" item lg={3} sm={2}>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
              <InputLabel htmlFor="standard-adornment-password">Search</InputLabel>
              <Input
                id="standard-adornment-password"
                type="text"
                onChange={handleSearchChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleSearchChange()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Topicsnavbar;
